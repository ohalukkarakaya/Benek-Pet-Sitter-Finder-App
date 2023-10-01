import libre from 'libreoffice-convert';
import XlsxPopulate from 'xlsx-populate';
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from 'dotenv';
import util from 'util';

//models
import User from "../../../models/User.js";
import ExpenseRecord from "../../../models/PaymentData/ExpenseRecord.js";

// helpers
import getLightWeightUserInfoHelper from "../..//getLightWeightUserInfoHelper.js";
import uploadFileHelper from "../../fileHelpers/uploadFileHelper.js";
import numberToTurkishHelper from "../../numberToTurkishHelper.js";

dotenv.config();

function escapeRegExp( text ){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const replaceText = async ( 
    inputPath,
    outputPath,
    outputPdfPath,
    jobTypeEnum,
    documentId,
    price,
    incomeTaxRatePercentage,
    fundSharePercentage,
    careGiverFulName,
    careGiverAdress,
    CareGiverIdNo,
    dateAsString
) => {
    
    const jobDesc = jobTypeEnum === "CareGive" 
                    || jobTypeEnum === "CareGiveExtension"
                    || jobTypeEnum === "ExtraMission"
                        ? "Bakıcılık" 
                        : "Bilet Satışı";

    const jobType = jobTypeEnum === "CareGive"
                    || jobTypeEnum === "CareGiveExtension"
                        ? "Evcil hayvan bakımı" 
                        : jobTypeEnum === "ExtraMission"
                            ? "Evcil hayvan bakımı ek görev hakkı"
                            : "Organizasyon bileti satışı";

    const incomeTaxRate = ( incomeTaxRatePercentage * price ) / 100;
    const fundShare = ( fundSharePercentage * price ) / 100;
    const totalCut = ( ( fundSharePercentage + incomeTaxRatePercentage ) * price ) / 100;
    const netAmount = price - totalCut;
    const priceWithWords = numberToTurkishHelper( price );

    const textsToReplace = [
        { cellNo: 'B5', find: '${officialPhoneNumberClipper}', replace: process.env.BENEK_OFICIAL_PHONE },
        { cellNo: 'B6', find: '${officialEmailClipper}', replace: process.env.BENEK_OFICIAL_EMAIL },
        { cellNo: 'B8', find: '${cityCodeClipper}', replace: process.env.MERSIS_IL_KOD },
        { cellNo: 'B9', find: '${taxOfficeClipper}', replace: process.env.VERGI_DAIRE },
        { cellNo: 'B9', find: '${taxIdNoClipper}', replace: process.env.VERGI_KIMLIK_NO },
        { cellNo: 'M5', find: '${docIdClipper}', replace: documentId },
        { cellNo: 'M7', find: '${dateClipper}', replace: dateAsString },
        { cellNo: 'B18', find: '${jobDescClipper}', replace: jobDesc },
        { cellNo: 'E18', find: '${jobTypeClipper}', replace: jobType },
        { cellNo: 'F18', find: '${jobCountClipper}', replace: "1" },
        { cellNo: 'I18', find: '${priceClipper}', replace: price },
        { cellNo: 'L18', find: '${amountClipper}', replace: price },
        { cellNo: 'L21', find: '${totalClipper}', replace: price },
        { cellNo: 'L22', find: '${taxPerClipper}', replace: incomeTaxRatePercentage },
        { cellNo: 'L23', find: '${taxClipper}', replace: incomeTaxRate },
        { cellNo: 'L24', find: '${fundShareClipper}', replace: fundShare },
        { cellNo: 'L25', find: '${totalCutClipper}', replace: totalCut },
        { cellNo: 'L26', find: '${AmountToPayClipper}', replace: netAmount },
        { cellNo: 'B22', find: '${totalAmountWithWordsInTurkish}', replace: priceWithWords },
        { cellNo: 'D24', find: '${careGiverFulNameClipper}', replace: careGiverFulName },
        { cellNo: 'D25', find: '${careGiverAddressDescClipper}', replace: careGiverAdress },
        { cellNo: 'D26', find: '${careGiverIDNoClipper}', replace: CareGiverIdNo },
        { cellNo: 'D28', find: '${taxAdministrationNoClipper}', replace: process.env.VERGI_DAIRE_KOD },
        { cellNo: 'D27', find: '${plateNoClipper}', replace: "-" },
    ];

    // Excel dosyasını oku
    const workbook = await XlsxPopulate.fromFileAsync( inputPath );
    const sheet = workbook.sheet('Sayfa1');

    for( const { cellNo, find, replace } of textsToReplace ){
        const cell = sheet.cell( cellNo );
        let cellValue = cell.value();

        const escapedSearchText = escapeRegExp(find);
        cellValue = cellValue.replace( new RegExp(escapedSearchText, 'g'), replace );
        cell.value( cellValue );
    }

    await workbook.toFileAsync( outputPath );

    const readFileAsync = util.promisify(fs.readFile);
    const writeFileAsync = util.promisify(fs.writeFile);

    try {
        // Dosyayı asenkron olarak oku
        const file = await readFileAsync(outputPath);

        // Dosyayı PDF'e dönüştür
        const pdfBuffer = await new Promise(
            ( resolve, reject ) => {
                libre.convert( file, '.pdf', undefined, ( err, done ) => {
                    if( err ){
                        reject( err );
                    }else{
                        resolve( done );
                    }
                });
            }
        );

        // PDF'i dosyaya yaz
        await writeFileAsync(outputPdfPath, pdfBuffer);
    }catch( err ){
        console.error(`Dönüşüm hatası: ${err}`);
    }
    let isPdfCreated = false
    while( !isPdfCreated ){
        let newFile = fs.existsSync( outputPdfPath );
        if( newFile ){
            isPdfCreated = true;
        }
    }
    fs.unlink(
        outputPath,
        ( err ) => {
        if( err ){
          console.error( 'Dosya silinirken hata oluştu:', err );
        }else{
          return true
        }
      }
    );
}

const expenseDocumentGenerationHelper = async ( paymentData, res ) => {
    try{
        const inputPath = path.resolve('./src/expenseDocumentTemplate.xlsx');
        const outputPath = path.resolve('./src/expenseDocument.xlsx');
        const outputPdfPath = path.resolve('./src/expenseDocument.pdf');

        const careGiver = await User.findById( paymentData.subSellerId );
        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

        //decrypt careGiver National IdNo
        const recordedIv = careGiver.identity.nationalId.iv;
        const cryptedNationalId = careGiver.identity.nationalId.idNumber;

        const iv = Buffer.from( recordedIv, 'hex' );
        const decipher = crypto.createDecipheriv(
                                            process.env.NATIONAL_ID_CRYPTO_ALGORITHM, 
                                            Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ), 
                                            iv
                                );

        let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8' );
        nationalIdNo += decipher.final( 'utf8' );

        const jobTypeEnum = paymentData.type;
        const fundSharePercentage = jobTypeEnum === "CareGive"
                                    || jobTypeEnum === "CareGiveExtension"
                                        ? 20
                                        : jobTypeEnum === "ExtraMission"
                                            ? 20
                                            : 20;

        const now = new Date();
        now.setHours( now.getHours() + 3 );

        const day = String( now.getDate() ).padStart( 2, "0" );
        const month = String( now.getMonth() + 1 ).padStart( 2, "0" );
        const year = now.getFullYear();

        const dateAsString = `${ day } / ${ month } / ${ year }`;
        
        const expenseRecord = await new ExpenseRecord(
            {
                careGiverId: paymentData.subSellerId,
                customerId: paymentData.customerId,
                careGiverGuid: paymentData.subSellerGuid,
                priceData: paymentData.priceData,
                parentContentId: paymentData.parentContentId,
                productDesc: paymentData.productDesc,
                type: jobTypeEnum
            }
        ).save();

        const replaceTextController = await replaceText(
            inputPath, 
            outputPath,
            outputPdfPath,
            paymentData.type, 
            expenseRecord._id.toString(),
            paymentData.priceData.price,
            10, 
            fundSharePercentage,
            careGiverInfo.userFullName, 
            careGiver.identity.openAdress, 
            nationalIdNo,
            dateAsString
        );

        const dateForName = `${day}_${month}_${year}`;

        const writenData = fs.readFileSync( outputPdfPath );
        const newDocName = "ExpenseDocument_" + expenseRecord._id.toString() + "_" + dateForName;

        const newNameToRename = path.resolve( './src/' + newDocName + '.pdf' );
        fs.rename(
            outputPdfPath, 
            newNameToRename, 
            ( err ) => {
                if ( err ){
                console.error('Dosya adı değiştirilirken hata oluştu:', err);
                }
            }
        )

        const dateForFolder = `${month}_${year}`;

        const pathToSend =  "OficialDocuments/ExpenseDocuments/" + dateForFolder + "/" + newDocName;
        const uploadDocumentToServer = await uploadFileHelper( writenData, newNameToRename, "expenseDocument", pathToSend, res );
        if( uploadDocumentToServer.error ){
            return {
                error: true,
                statusCode: 500,
                message: "Internal Server Error"
            }
        }

        expenseRecord.expensePdfDocumentUrl = `${ pathToSend }.pdf`;
        expenseRecord.markModified( "expensePdfDocumentUrl" );
        expenseRecord.save(
            ( err ) => {
                if( err ) {
                    console.error('ERROR: While Update!', err);
                }
              }
        );

        fs.unlink(
            newNameToRename, 
            ( err ) => {
            if( err ){
              console.error( 'Dosya silinirken hata oluştu:', err );
            }else{
              return true;
            }
          }
        );

        await paymentData.deleteOne();
        return {
            error: false,
            statusCode: 200,
            message: "Succesful",
            data: {
                ContentType: "application/pdf",
                path: `${ pathToSend }.pdf`
            }
        }
    }catch( err ){
        console.log( "ERROR: expenseDocumentGenerationHelper - ", err );
        return {
            error: true,
            statusCode: 500,
            message: "Internal Server Error"
        }
    }
}

export default expenseDocumentGenerationHelper;
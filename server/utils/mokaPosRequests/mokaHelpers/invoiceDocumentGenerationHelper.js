import libre from 'libreoffice-convert';
import XlsxPopulate from 'xlsx-populate';
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from 'dotenv';
import util from 'util';
import nodemailer from 'nodemailer';

//models
import User from "../../../models/User.js";
import InvoiceRecord from "../../../models/PaymentData/InvoiceRecord.js";

// helpers
import getLightWeightUserInfoHelper from "../..//getLightWeightUserInfoHelper.js";
import uploadFileHelper from "../../fileHelpers/uploadFileHelper.js";
import numberToTurkishHelper from "../../numberToTurkishHelper.js";
import invoiceEmailHtmlHelper from "./invoiceEmailHtmlHelper.js";

dotenv.config();

const RichText = XlsxPopulate.RichText;

function escapeRegExp( text ){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const prepareInvoicePaper = async (
    templatePath, // şablon yolu
    outputPath, // xlsx dosyası çıktı yolu
    outputPdfPath, // pdf dosyası çıktı yolu
    pages, // sayfalara bölünmüş ödeme verisi listesi
    documentId, // fatura kayıt idsi
    totalPrice, // toplam fiyat
    careGiverFulName, // hizmet veren tam isim
    customerName, // müşteri tam isim
    careGiverEmail, // hizmet veren eposta
    dateAsString, // string tipinde ödeme onayının yapıldığı tarih
    shortDate // kısaltılmış tarih verisi örnk. - "03 EKI '23"
) => {

    //toplam fiyatı yazıya çevir
    const totalPriceWithWords = numberToTurkishHelper( totalPrice );

    let inputPath = templatePath;
    const templateWorkbook = await XlsxPopulate.fromFileAsync( inputPath );

    //sayfaları ekle
    for ( let i = 0; i < pages.length; i++ ){

        const isLastPage = i === pages.length - 1;
        let templateSheetName = !isLastPage ? 'Sayfa1' : 'Sayfa2';

        let replaceTextsList = [
            { cellNo: 'B7', find: '${customerNameClipper}', replace: customerName },
            { cellNo: 'L7', find: '${taxIdNoClipper}', replace: process.env.VERGI_KIMLIK_NO },
            { cellNo: 'D9', find: '${dateClipper}', replace: dateAsString },
            { cellNo: 'D10', find: '${documentIdClipper}', replace: documentId },
        ];

        if( isLastPage ){
            replaceTextsList.push( { cellNo: 'D61', find: '${subSellerFulNameClipper}', replace: careGiverFulName } );
            replaceTextsList.push( { cellNo: 'D62', find: '${subSellerEmailClipper}', replace: careGiverEmail } );
            replaceTextsList.push( { cellNo: 'H61', find: '${shortDateClipper}', replace: shortDate } );
            replaceTextsList.push( { cellNo: 'L61', find: '${price}', replace: totalPrice.toString().replaceAll('.', ',') } );
            replaceTextsList.push( { cellNo: 'K63', find: '${totalPriceWithTurkishWordsClipper}', replace: totalPriceWithWords } );
            replaceTextsList.push( { cellNo: 'J67', find: '${officialEmail}', replace: process.env.BENEK_OFICIAL_EMAIL } );
            replaceTextsList.push( { cellNo: 'L67', find: '${officialPhoneNumber}', replace: process.env.BENEK_OFICIAL_PHONE } );
        }

        const sheetToClone = templateWorkbook.sheet( templateSheetName );
        const sheet = templateWorkbook.cloneSheet( sheetToClone, `Sheet${ i + 1 }`, 2 + i );

        for( const { cellNo, find, replace } of replaceTextsList ){
            const cell = sheet.cell( cellNo );
            let cellValue = cell.value() instanceof RichText ? cell.value().text() : cell.value();
    
            const escapedSearchText = escapeRegExp( find );
            cellValue = cellValue.replace( new RegExp(escapedSearchText, 'g'), replace );
            cell.value() instanceof RichText ? cell.value().text( cellValue ) : cell.value( cellValue );
        }
        
        let rowNo = 17;
        //ödeme verilerini hazırla
        for( let indx = 0; indx < pages[ i ].length; indx ++ ){
            let payment = pages[ i ][ indx ];
            
            if( indx > 0 ){ rowNo = rowNo + 2 }

            const day = String( new Date( payment.createdAt ).getDate() ).padStart( 2, "0" );
            const month = String( new Date( payment.createdAt ).getMonth() + 1 ).padStart( 2, "0" );
            const year = new Date( payment.createdAt ).getFullYear().toString();
            const paymentDate = `${ day }/${ month }/${ year }`;

            const descStart = payment.type === "CareGive"
                                ? `Evcil Hayvan Bakımı`
                                : payment.type === "CareGiveExtension"
                                    ? `Evcil Hayvan Bakımı Süre Uzatması`
                                    : payment.type === "ExtraMission"
                                        ? `Evcil Hayvan Bakımı Ek Görev Hakkı`
                                        : payment.type === "EventTicket"
                                            ? `Organizasyon Bileti`
                                            : `Bağış`;


            const comissionPrice = ( payment.priceData.price * 30 ) / 100; 
            const paymentDesc = `${ descStart } | ${ paymentDate } `;
            const comission = `${ comissionPrice.toString().replaceAll('.', ',') } ₺`;
            const servicePrice = `${ ( payment.priceData.price - comissionPrice ).toString().replaceAll('.', ',') } ₺`;
            const paidPrice = `${ payment.priceData.price.toString().replaceAll('.', ',') } ₺`;

            const descCellNo = `B${rowNo}`;
            const servicePriceCellNo = `H${rowNo}`;
            const comissionCellNo = `J${rowNo}`;
            const paidPriceCellNo = `L${rowNo}`;

            //write payment desc
            const descCell = sheet.cell( descCellNo );
            descCell.value( paymentDesc );

            //write service price
            const servicePriceCell = sheet.cell( servicePriceCellNo );
            servicePriceCell.value( servicePrice );

            //write comission
            const comissionCell = sheet.cell( comissionCellNo );
            comissionCell.value( comission );

            //write paid total price of payment
            const paidPriceCell = sheet.cell( paidPriceCellNo );
            paidPriceCell.value( paidPrice );
        }
    }

    templateWorkbook.deleteSheet("Sayfa1");
    templateWorkbook.deleteSheet("Sayfa2");

    await templateWorkbook.toFileAsync( outputPath );

    const readFileAsync = util.promisify(fs.readFile);
    const writeFileAsync = util.promisify(fs.writeFile);

    try {
        // Dosyayı asenkron olarak oku
        const file = await readFileAsync( outputPath );

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
        await writeFileAsync( outputPdfPath, pdfBuffer );
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

const invoiceDocumentGenerationHelper = async ( userId, expensionRecordIdiesList, paymentDataList, res ) => {
    try{
        //temp file randId
        const randId = crypto.randomBytes( 6 ).toString( 'hex' );

        // şablonların yerini bul
        const templatePath = path.resolve('./src/invoiceTemplate.xlsx');
        
        // oluşturulacak dosyaların yerlerini belirle
        const outputPath = path.resolve(`./src/invioceDocument_${randId}.xlsx`);
        const outputPdfPath = path.resolve(`./src/invioceDocument_${randId}.pdf`);

        // müşterinin ödediği toplam fiyatı belirle
        let totalPrice = 0;

        // ödeme verilerinden sayfaları oluştur
        let pages = [];

        // son sayfa şablonuna en fazla 18 veri yazıldığı için,
        // eğer 18den fazla ödeme verisi varsa ilk sayfa şablonuna yazılacak
        // verileri ayır
        if( paymentDataList.length > 18 ){
            
            let page = [];

            let remainedPaymentCount = paymentDataList.length;
            let limit = 18;

            for( let payment of paymentDataList ){
                totalPrice = totalPrice + payment.priceData.price;
                if( 
                    page.length < limit - 1 
                    && remainedPaymentCount > 1
                ){
                    page.push( payment );
                    remainedPaymentCount = remainedPaymentCount - 1;
                }else{
                    page.push( payment );
                    remainedPaymentCount = remainedPaymentCount - 1;

                    pages.push( page );
                    page = [];
                }
            }
            
        }else{
            for( let payment of paymentDataList ){ totalPrice = totalPrice + payment.priceData.price; }
            pages.push( paymentDataList ); 
        }

        const paymentData = paymentDataList[ 0 ];
        const careGiver = await User.findById( paymentData.subSellerId );
        const careGiverInfo = careGiver ? getLightWeightUserInfoHelper( careGiver ) : { userId: "Deleted User", userProfileImg: "", username: "Deleted User", userFullName: "Deleted User" };
        
        const customer = await User.findById( paymentData.customerId.toString() );
        const customerInfo = getLightWeightUserInfoHelper( customer );

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
        let months = { '01': 'OCA', '02': 'ŞUB', '03': 'MAR', '04': 'NIS', '05': 'MAY', '06': 'HAZ', '07': 'TEM', '08': 'AĞU', '09': 'EYL', '10': 'EKI', '11': 'KAS', '12': 'ARA' };
        const day = String( now.getDate() ).padStart( 2, "0" );
        const month = String( now.getMonth() + 1 ).padStart( 2, "0" );
        const year = now.getFullYear();

        const dateAsString = `${ day } / ${ month } / ${ year }`;
        const shortDate = `${ day } ${ months[ month.toString() ] } '${ year % 100 }`;
        
        const invoiceRecord = await new InvoiceRecord(
            {
                careGiverId: careGiver._id.toString(),
                customerId: paymentData.customerId,
                careGiverGuid: userId,
                priceData: totalPrice, // total payment
                connectedExpensionsIdsList: expensionRecordIdiesList
            }
        ).save();

        await prepareInvoicePaper(
            templatePath,
            outputPath,
            outputPdfPath,
            pages,
            invoiceRecord._id.toString(),
            totalPrice,
            careGiverInfo.userFullName,
            customerInfo.userFullName,
            careGiver.email,
            dateAsString,
            shortDate
        );

        const dateForName = `${day}_${month}_${year}`;

        const writenData = fs.readFileSync( outputPdfPath );
        const newDocName = "InvoiceDocument_" + invoiceRecord._id.toString() + "_" + dateForName;

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

        const pathToSend =  "OficialDocuments/InvoiceDocuments/" + dateForFolder + "/" + newDocName;
        const uploadDocumentToServer = await uploadFileHelper( writenData, newNameToRename, "expenseDocument", pathToSend, res ? res : null );
        if( uploadDocumentToServer.error ){
            return {
                error: true,
                statusCode: 500,
                message: "Internal Server Error"
            }
        }

        invoiceRecord.invoicePdfDocumentUrl = `${ pathToSend }.pdf`;
        invoiceRecord.markModified( "invoicePdfDocumentUrl" );
        invoiceRecord.save(
            ( err ) => {
                if( err ) {
                    console.error('ERROR: While Update!', err);
                }
              }
        );

        //send email
        let transporter = nodemailer.createTransport(
            {
                host: process.env.AUTH_EMAIL_HOST,
                port: process.env.AUTH_EMAIL_PORT,
                secure: true,
                dkim: {
                  domainName: process.env.DKIM_DOMAIN,
                  keySelector: process.env.DKIM_SELECTOR,
                  privateKey: fs.readFileSync(
                                        process.env.DKIM_PRIVATE_KEY_FILE_PATH, 
                                        "utf8"
                                ),
                  cacheDir: '/tmp',
                  cacheTreshold: 2048,
                },
                auth: {
                  user: process.env.AUTH_EMAIL,
                  pass: process.env.AUTH_PASS,
                }
              }
          );

          const htmlEmail = invoiceEmailHtmlHelper();

          //mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: customer.email,
            subject: `Benek App Faturanız`,
            html: htmlEmail,
            attachments: [{
                filename: newDocName + '.pdf',
                path: newNameToRename,
                contentType: 'application/pdf'
              }],
          };

          await transporter.sendMail( mailOptions );

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

export default invoiceDocumentGenerationHelper;
const { PDFDocument, degrees, PageSizes } = require('pdf-lib');
const fs = require('fs').promises;

//helpers
const cleanTempFilesHelper = require( './cleanTempFilesHelper' );

const checkPdfFileHelper = async ( tempFilePath ) => {
    try{
        // PDF dosyasını oku
        const pdfData = await fs.readFile( tempFilePath );

        // PDF dokümanını oluştur
        const pdfDoc = await PDFDocument.load( pdfData );

        // İlk sayfayı al
        const [ firstPage ] = pdfDoc.getPages();

        // Sayfanın boyutunu al
        const { width, height } = firstPage.getSize();

        // Yatay A4 boyutunu tanımla (210mm x 297mm)
        const a4Width = PageSizes.A4[ 0 ];
        const a4Height = PageSizes.A4[ 1 ];

        // Oran toleransı
        const tolerance = 0.01;

        if( 
            pdfDoc.getPages().length > 1
            || (
                Math.abs( width / height - a4Width / a4Height ) > tolerance
                && Math.abs( height / width - a4Width / a4Height ) > tolerance
            )
        ){
            await cleanTempFilesHelper( tempFilePath );
            return {
                error: true,
                message: "file is not A4 format"
            }
        }

        // PDF'nin yatay mı dikey mi olduğunu kontrol et
        const isLandscape = width > height;

        // Eğer PDF dikey bir A4'ten farklı bir boyutta ise
        if( !isLandscape ){
            // PDF'yi yatay A4 boyutuna çevir
            firstPage.setRotation( degrees( 90 ) );
            firstPage.setSize( a4Width, a4Height );
        }

        const isFileExists = await fs.access( tempFilePath )
                                     .then(
                                        () => true
                                      ).catch(
                                        () => false
                                      );

        if ( isFileExists ){
            fs.unlink(
                tempFilePath, 
                ( err ) => {
                    if( err ){
                        console.error( 'Dosya silinirken hata oluştu:', err );
                    }
                }
            );
          }

        // Düzeltme işlemi tamamlandıktan sonra PDF'i kaydet
        const correctedPdfBytes = await pdfDoc.save();

        // Düzeltildikten sonra PDF'i kaydet
        await fs.writeFile( tempFilePath, correctedPdfBytes );

    }catch( err ){
        await cleanTempFilesHelper( tempFilePath );
        console.error( 'Pdf filtreleme algoritması hatası:', err );
    }
}

module.exports = checkPdfFileHelper;
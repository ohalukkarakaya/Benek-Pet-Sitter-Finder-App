const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs')

//helpers
const config = require( '../config' );
const cleanTempFilesHelper = require( './cleanTempFilesHelper' );

const compressPdfHelper = async ( tempFilePath, fileType, outputPath ) => {
    try{
        // PDF dosyasını oku
        const pdfData = await fs.readFile( tempFilePath );

        // PDF dokümanını oluştur
        const pdfDoc = await PDFDocument.load( pdfData );

        // Tüm sayfaları al
        const pages = pdfDoc.getPages();

        // Sıkıştırma kalitesi ve renk ayarlarını belirle
        const quality = 0.7; // 0 ile 1 arasında bir değer kullanabilirsiniz (1 en iyi kalite)
        const colorRgb = rgb( 0, 0, 0 ); // Siyah beyaz için

        // Tüm sayfaları sıkıştırma işlemine tabi tut
        for( const page of pages ){
            await page.compressImages( quality, colorRgb );
        }

        // Sıkıştırılmış PDF'i oluştur
        let compressedPdfBytes = await pdfDoc.save();

        // Hedef boyuta ulaşıncaya kadar döngüde sıkıştırma işlemi tekrarla
        while( 
            compressedPdfBytes.length > config().maxFileSizes[ fileType.toString() ]
            && quality > 0.4
        ){

            quality -= 0.1; // Kaliteyi düşür
            for( const page of pages ){
                await page.compressImages( quality, colorRgb );
            }
            compressedPdfBytes = await pdfDoc.save();
        }

        // Sıkıştırılmış PDF'i kaydet
        await fs.writeFile( outputPath, compressedPdfBytes );

        if ( fs.existsSync( tempFilePath ) ){
            fs.unlink(
                tempFilePath, 
                ( err ) => {
                    if( err ){
                        console.error( 'Dosya silinirken hata oluştu:', err );
                    }
                }
            );
          }

    }catch( err ){
        await cleanTempFilesHelper( tempFilePath );
        console.error( 'Pdf sıkıştırma hatası:', error );
    }
}

module.exports = compressPdfHelper;
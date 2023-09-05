const fs = require('fs');
const Jimp = require('jimp');

// helpers
const getVideoDurationHelper = require( '../getVideoDurationHelper.js' );
const compressVideoHelper = require( '../compressVideoHelper' );
const compressImageHelper = require( '../compressImageHelper' );

const cleanTempFilesHelper = require( '../cleanTempFilesHelper' ); 

const compressProcessHelper = async (
    fileSize,
    maxFileSize,
    maxDuration,
    videoMetadata,
    tempFilePath,
    fileType
) => {
    if( 
        fileSize > parseFloat( maxFileSize ) 
        || maxDuration 
    ){
        try {
          if( maxDuration && fileType === 4 ){
  
            const duration = await getVideoDurationHelper( videoMetadata );
  
            // videosüresi varsayılan süreden uzunsa yüklemeyi iptal et ve hata gönder
            if( duration > maxDuration ){
              await cleanTempFilesHelper( tempFilePath );
  
              return {
                error: true,
                message: "video duration is too long"
              }
            }
            
            await compressVideoHelper( tempFilePath, maxFileSize );
            
          }else if( fileType !== 6 ){
  
            for(
              let quality = 50;
              quality >= 10 && fileSize > maxFileSize;
              quality -= 10
            ){
              await compressImageHelper(
                tempFilePath,
                quality
              );
              
              let image = null;
              while ( image === null ){
                try {
                  image = await Jimp.read( tempFilePath );
                }catch( error ){
                  // Hata alındı, beklemeye devam edin
                }
              }
  
              if( image ){
                const newFileSize = fs.statSync( tempFilePath ).size;
                return newFileSize;
              }
            }
  
            if( fileSize > maxFileSize ){
                await cleanTempFilesHelper( tempFilePath );
  
                return res.status( 400 )
                          .json(
                            {
                              error: true,
                              message: "Image size is too big, please upload smaller image"
                            }
                          );
            }
          }
        }catch( err ){
          await cleanTempFilesHelper( tempFilePath );
  
          console.error( 'Dosya boyutunu düşürme hatası:', err );
          return res.status( 500 )
                    .json(
                        { 
                          error: true,
                          message: 'Dosya boyutunu düşürme sırasında bir hata oluştu.' 
                        }
                     );
        }
    }
}

module.exports = compressProcessHelper;
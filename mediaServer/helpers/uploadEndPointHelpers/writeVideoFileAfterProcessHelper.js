const fs = require('fs');
const cleanTempFilesHelper = require("../cleanTempFilesHelper");

const writeVideoFileAfterProcessHelper = async (
    newPath,
    dirName,
    tempFilePath
) => {
    // eğer dosya zaten varsa sil
    if( fs.existsSync( newPath ) ){

        fs.unlinkSync( newPath );
      }

      //eğer klasör yoksa oluştur
      if( !fs.existsSync( dirName ) ){

        // yeni klasörü oluşturur
        fs.mkdirSync(
          dirName, 
          { recursive: true }
        );
      }

      const isVideoCompressed = fs.existsSync( 'ffmpeg_compress_' + tempFilePath );
      const isVideoCropped = fs.existsSync( 'ffmpeg_' + tempFilePath );

      let pathToProcess = tempFilePath;

      if( isVideoCropped ){

        if( fs.existsSync( tempFilePath ) ){
          fs.unlinkSync( tempFilePath );
        }

        pathToProcess = 'ffmpeg_' + tempFilePath;

      }

      if( isVideoCompressed ){

        if( fs.existsSync( tempFilePath ) ){
          fs.unlinkSync( tempFilePath );
        }

        if( isVideoCropped ){
          fs.unlinkSync( 'ffmpeg_' + tempFilePath )
        }

        pathToProcess = 'ffmpeg_compress_' + tempFilePath;

      }

      await fs.rename(
        pathToProcess,
        newPath, 
        ( err ) => {
            if( err ){
                cleanTempFilesHelper( tempFilePath );
                console.error( 'Dosya adı değiştirme hatası:', err );
            }else{
              if( fs.existsSync( tempFilePath ) ){

                fs.unlinkSync( tempFilePath );
        
              }
            }
        }
      )
}

module.exports = writeVideoFileAfterProcessHelper;
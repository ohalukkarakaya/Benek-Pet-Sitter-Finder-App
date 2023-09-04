const fs = require( 'fs' );

const cleanTempFilesHelper = async ( tempFilePath ) => {
    // delete temp files
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

  if( fs.existsSync( 'ffmpeg_' + tempFilePath ) ){
    fs.unlink(
        'ffmpeg_' + tempFilePath, 
        ( err ) => {
            if( err ){
                console.error( 'Dosya silinirken hata oluştu:', err );
            }
        }
    );
  }
  if( fs.existsSync( 'ffmpeg_compress_' + tempFilePath ) ){
    fs.unlink(
        'ffmpeg_compress_' + tempFilePath, 
        ( err ) => {
            if( err ){
                console.error( 'Dosya silinirken hata oluştu:', err );
            }
        }
    );
  }
};

module.exports = cleanTempFilesHelper;
const ffmpeg = require( 'fluent-ffmpeg' );
const util = require( 'util' );
const fs = require( 'fs' );
const ffprobe = util.promisify( ffmpeg.ffprobe );

const cleanTempFilesHelper = require( './cleanTempFilesHelper' );

const compressVideoHelper = async ( tempFilePath, maxFileSize ) => {
  try{
    let fileSize = fs.statSync( tempFilePath ).size;
    let newBitrate = 1000; // İlk başta kullanılacak varsayılan bitrate değeri (örnek olarak 1000 kbps)

    let path = tempFilePath;

    if ( await fs.existsSync( 'ffmpeg_' + tempFilePath ) ){
      path = 'ffmpeg_' + tempFilePath;
    }

    // Dosyanın boyutunu düşürmek için bitrate değerini dinamik olarak ayarlayın
    while ( fileSize > parseFloat( maxFileSize ) && newBitrate > 100 ){
      try{
        // Video sıkıştırma işlemini paralel olarak yürütün
        await Promise.all(
          [
            new Promise(
                ( resolve, reject ) => {
                    const command = ffmpeg( path ).toFormat('mp4')
                                                  .videoBitrate(newBitrate + 'k')
                                                  .on(
                                                        'error', 
                                                        ( err ) => {
                                                            console.error( 'ffmpeg hatası:', err );
                                                            reject( err );
                                                        }
                                                  ).on(
                                                        'end', 
                                                        () => {
                                                            resolve();
                                                        }
                                                    );

                    command.save( 'ffmpeg_compress_' + tempFilePath )
                           .run();
                }
            ),
          ]
        );

        fileSize = fs.statSync( 'ffmpeg_compress_' + tempFilePath ).size;

        if( fileSize > maxFileSize ){
          newBitrate -= 100;
        }else{
          // Sıkıştırma işlemi dosya boyutunu azalttı, döngüyü sonlandırın
          break;
        }
      }catch( error ){
        await cleanTempFilesHelper( tempFilePath );
        console.error( 'Dosya boyutunu düşürme hatası:', error );
        break;
      }
    }
  }catch( err ){
    await cleanTempFilesHelper( tempFilePath );
    console.error( err );
  }
};

module.exports = compressVideoHelper;
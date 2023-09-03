const ffmpeg = require( 'fluent-ffmpeg' );
const util = require( 'util' );
const fs = require( 'fs' );
const chmodPromise = util.promisify( fs.chmod );
const ffprobe = util.promisify( ffmpeg.ffprobe );

const compressVideoHelper = async (
    tempFilePath,
    maxFileSize
) => {
    try{
        const tempfileSize = fs.statSync( tempFilePath ).size;
        let newBitrate = 1000; // İlk başta kullanılacak varsayılan bitrate değeri (örnek olarak 1000 kbps)

        let path = tempFilePath

        if( fs.existsSync( 'ffmpeg_' + tempFilePath ) ){

            path = 'ffmpeg_' + tempFilePath

        }

        // Dosyanın boyutunu düşürmek için bitrate değerini dinamik olarak ayarlayın
        while( tempfileSize > parseFloat( maxFileSize )  && newBitrate > 100 ){
            try {
                await new Promise(
                    ( resolve, reject ) => {
                        ffmpeg( path ).toFormat('mp4')
                                              .videoBitrate( newBitrate + 'k' )
                                              .on(
                                                'error', 
                                                ( err ) => {
                                                    console.error('ffmpeg hatası:', err);
                                                    reject( err );
                                                }
                                              ).save( 'ffmpeg_compress_' + tempFilePath )
                                               .on(
                                                'end', 
                                                () => {
                                                    resolve();
                                                }
                                              ).run();
                    }
                );

                const newFileSize = fs.statSync( 'ffmpeg_compress_' + tempFilePath )
                                      .size;

                if( newFileSize > maxFileSize ){
                    newBitrate -= 100;
                }else{
                    // Sıkıştırma işlemi dosya boyutunu azalttı, döngüyü sonlandırın
                    break;
                }
            }catch( error ){
                console.error( 'Dosya boyutunu düşürme hatası:', error );
                break;
            }
        }
        console.log( "Video mümkün olduğu kadar sıkıştırıldı ve kaydedildi." )
    }catch( err ){
        console.log( err );
    }
}

module.exports = compressVideoHelper;
const ffmpeg = require( 'fluent-ffmpeg' );
const util = require( 'util' );
const fs = require( 'fs' );
const chmodPromise = util.promisify( fs.chmod );
const ffprobe = util.promisify( ffmpeg.ffprobe );

const getVideoDimensionsHelper = require( './getVideoDimensionsHelper' );

const cropVideoHelper = async ( 
    fileType,
    tempFilePath,
    videoMetadata
) => {
    try {
        if( fileType === 'video' ){
            const { width, height } = await getVideoDimensionsHelper( tempFilePath, videoMetadata );
    
            // Hedef en-boy oranı 9:16
            const targetAspectRatio = 9 / 16;

            // eğer istenen aspect ratioda değilse
            if( width / height !== targetAspectRatio ){
                // Dosyanın izinlerini ayarla
                await chmodPromise( process.cwd() + '/ffmpeg', '777' );

                let ffmpegCommand;

                // Eğer mevcut en-boy oranı hedef orandan büyükse
                if( width / height > targetAspectRatio ){

                    const newWidth = height * targetAspectRatio;
                    const xOffset = ( width - newWidth ) / 2;

                    ffmpegCommand = `-vf crop=${ newWidth }:${ height }:${ xOffset },setdar=0.5625`;
                }
                // Eğer mevcut en-boy oranı hedef orandan küçükse
                else if( width / height < targetAspectRatio ){

                    const newHeight = width / targetAspectRatio;
                    const yOffset = ( height - newHeight ) / 2;

                    ffmpegCommand = `-vf crop=${ width }:${ newHeight }:0:${ yOffset },setdar=0.5625`;
                }
                
                try{
                    // crop komutunu çalıştır
                    await new Promise(
                        (
                            resolve, 
                            reject
                        ) => {
                            ffmpeg( tempFilePath ).toFormat('mp4')
                                                  .addOptions( ffmpegCommand )
                                                  .on(
                                                    'error', 
                                                    ( error ) => {
                                                        console.log( 'Failed to process video: ' + error );
                                                        reject( error );
                                                    }
                                                   ).save( 'ffmpeg_' + tempFilePath )
                                                    .on(
                                                        'end', 
                                                        () => {
                                                            console.log( 'Video 9:16 oranında kırpıldı ve kaydedildi.' );
                                                            
                                                            resolve();
                                                        }
                                                    ).run();
                        }
                    );
                }catch( err ){
                    console.log( err );
                }
            }
        
            
        }
      }catch( error ){
        console.error( 'Video kırma hatası:', error );
      }
}

module.exports = cropVideoHelper;
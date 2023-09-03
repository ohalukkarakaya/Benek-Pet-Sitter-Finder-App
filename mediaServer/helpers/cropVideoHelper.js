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
        
            // Dosyanın izinlerini ayarla
            await chmodPromise( process.cwd() + '/ffmpeg', '777' );

            // Eğer mevcut en-boy oranı hedef orandan büyükse
            if( width / height > targetAspectRatio ){

                const newWidth = height * targetAspectRatio;
                const xOffset = ( width - newWidth ) / 2;

                try{
                    await new Promise(
                      (
                        resolve, 
                        reject
                      ) => {
                        ffmpeg( tempFilePath ).toFormat('mp4')
                                              .addOptions( `-vf crop=${ newWidth }:${ height }:${ xOffset },setdar=0.5625` )
                                              .on(
                                                'error', 
                                                ( error ) => {
                                                    console.log( 'Failed to process video: ' + error );
                                                    reject( error );
                                                }
                                              ).save( 'ffmpeg_' + tempFilePath )
                                               .on(
                                                    'progress', 
                                                    ( progress ) => {
                                                        console.log( progress );
                                                    }
                                                ).on(
                                                    'end', 
                                                    () => {
                                                        if( fs.existsSync( tempFilePath ) ){

                                                            fs.rename(
                                                                'ffmpeg_' + tempFilePath, 
                                                                tempFilePath, 
                                                                ( err ) => {
                                                                    if( err ){
                                                                        console.error( 'Dosya adı değiştirme hatası:', err );
                                                                    } 
                                                                }
                                                            )
                                                
                                                            fs.unlinkSync( tempFilePath );
                                                
                                                        }
                                                        resolve();
                                                    }
                                                ).run();
                      }
                    );
                }catch( err ){
                    console.log( err );
                }
            }
            // Eğer mevcut en-boy oranı hedef orandan küçükse
            else if( width / height < targetAspectRatio ){

                const newHeight = width / targetAspectRatio;
                const yOffset = ( height - newHeight ) / 2;

                try{
                    await new Promise(
                      (
                        resolve, 
                        reject
                      ) => {
                        ffmpeg( tempFilePath ).toFormat('mp4')
                                              .addOptions( `-vf crop=${ width }:${ newHeight }:0:${ yOffset },setdar=0.5625` )
                                              .on(
                                                'error', 
                                                ( error ) => {
                                                    console.log( 'Failed to process video: ' + error );
                                                    reject( error );
                                                }
                                              ).save( 'ffmpeg_' + tempFilePath )
                                               .on(
                                                    'progress', 
                                                    ( progress ) => {
                                                        console.log( progress );
                                                    }
                                                ).on(
                                                    'end', 
                                                    () => {
                                                        if( fs.existsSync( tempFilePath ) ){

                                                            fs.rename(
                                                                'ffmpeg_' + tempFilePath, 
                                                                tempFilePath, 
                                                                ( err ) => {
                                                                    if( err ){
                                                                        console.error( 'Dosya adı değiştirme hatası:', err );
                                                                    } 
                                                                }
                                                            )
                                                
                                                            fs.unlinkSync( tempFilePath );
                                                
                                                        }
                                                        resolve();
                                                    }
                                                ).run();
                      }
                    );
                }catch( err ){
                    console.log( err );
                }
            }
        
            console.log( 'Video 9:16 oranında kırıldı ve kaydedildi.' );
        }
      }catch( error ){
        console.error( 'Video kırma hatası:', error );
      }
}

module.exports = cropVideoHelper;
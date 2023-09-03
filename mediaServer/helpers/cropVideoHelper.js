const ffmpeg = require( 'fluent-ffmpeg' );
const path = require( 'path' );
const fs = require( 'fs' ).promises;

const getVideoDimensionsHelper = require( './getVideoDimensionsHelper' );

const cropVideoHelper = async ( 
    fileType,
    tempFilePath
) => {
    try {
        if( fileType === 'video' ){
            const { width, height } = await getVideoDimensionsHelper( inputPath );
    
            // Hedef en-boy oranı 9:16
            const targetAspectRatio = 9 / 16;
        
            // Eğer mevcut en-boy oranı hedef orandan büyükse
            if( width / height > targetAspectRatio ){

                const newWidth = height * targetAspectRatio;
                const xOffset = ( width - newWidth ) / 2;

                await fs.chmod(
                    process.cwd()+'/ffmpeg', 
                    '777',
                    () => {
                        ffmpeg().input( tempFilePath )
                                .setpts( 'PTS-STARTPTS' )
                                .filter(
                                    'crop', 
                                    `${ newWidth }:${ height }:${ xOffset }:0`
                                 ).output( tempFilePath )
                                  .run();
                    }
                );
            
            }

            // Eğer mevcut en-boy oranı hedef orandan küçükse
            else if( width / height < targetAspectRatio ){

                const newHeight = width / targetAspectRatio;
                const yOffset = ( height - newHeight ) / 2;

                await fs.chmod(
                    process.cwd()+'/ffmpeg', 
                    '777',
                    () => {
                        ffmpeg().input( tempFilePath )
                                .setpts( 'PTS-STARTPTS' )
                                .filter(
                                  'crop', 
                                  `${ width }:${ newHeight }:0:${ yOffset }`
                                ).output( tempFilePath )
                                 .run();
                    }
                );
            }
        
            console.log( 'Video 9:16 oranında kırıldı ve kaydedildi.' );
        }
      }catch( error ){
        console.error( 'Video kırma hatası:', error );
      }
}

module.exports = cropVideoHelper;
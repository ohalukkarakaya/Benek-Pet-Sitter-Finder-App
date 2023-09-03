const ffmpeg = require('fluent-ffmpeg');
const fs = require( 'fs' ).promises;

const getVideoDimensionsHelper = async ( videoPath ) => {
    return new Promise(
        ( resolve, reject ) => {
            fs.chmod(
                process.cwd()+'/ffmpeg', 
                '777',
                () => {
                    ffmpeg.ffprobe(
                        videoPath, 
                        ( err, metadata ) => {
                            if( err ){
                                reject( err );
                            }else{
                                const width = metadata.streams[ 0 ].width;
                                const height = metadata.streams[ 0 ].height;
                                resolve({ width, height });
                            }
                        }
                    );
                }
            );
            
        }
    );
}

module.exports = getVideoDimensionsHelper;
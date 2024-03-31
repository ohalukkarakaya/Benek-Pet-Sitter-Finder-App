const ffmpeg = require( 'fluent-ffmpeg' );
const fs = require( 'fs' );
const util = require("util");
const path = require("path");
const ffprobe = util.promisify( ffmpeg.ffprobe );

const getVideoThumbnailHelper = async ( videoDir ) => {
    try{
        const videoPath = path.join( __dirname, '../../assets', videoDir );
        const videoThumbnailDir = videoDir.split('/').pop().split( '.' ).shift() + '.png';
        const tempDir = path.join( __dirname, '../../assets/tmp/' );
        const videoThumbnailPath = path.join( __dirname, '../../assets/tmp/', videoThumbnailDir );
        const videoThumbnail = await new Promise(
            ( resolve, reject ) => {
                ffmpeg( videoPath )
                .on( 'end', () => {
                    resolve( videoThumbnailPath );
                })
                .on( 'error', ( err ) => {
                    reject( err );
                })
                .screenshots(
                    {
                        count: 1,
                        folder: tempDir,
                        filename: videoThumbnailPath.split( '/' ).pop()
                    }
                );
            }
        );

        return videoThumbnail;
    }catch( err ){
        console.log( "ERROR: getVideoThumbnailHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

module.exports = getVideoThumbnailHelper;
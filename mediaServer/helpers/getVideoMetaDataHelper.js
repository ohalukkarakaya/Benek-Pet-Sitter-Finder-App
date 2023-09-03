const ffmpeg = require( 'fluent-ffmpeg' );
const util = require( 'util' );
const fs = require( 'fs' );
const chmodPromise = util.promisify( fs.chmod );
const ffprobe = util.promisify( ffmpeg.ffprobe );

const getVideoMetaDataHelper = async ( videoPath ) => {
    try{
      // Dosyanın izinlerini ayarla
      await chmodPromise( process.cwd() + '/ffmpeg', '777' );

      // Metadata almak için ffprobe kullan
      const metadata = await ffprobe( videoPath );

      return metadata;
    }catch( err ){
        console.log( "Video metaData hatası - ", err );
    }
};

module.exports = getVideoMetaDataHelper;
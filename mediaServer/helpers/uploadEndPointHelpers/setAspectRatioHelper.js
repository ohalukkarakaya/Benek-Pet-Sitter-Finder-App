const fs = require('fs');

const config = require( '../../config' );

//helpers
const cropImageHelper = require( '../cropImageHelper' );
const cropVideoHelper = require( '../cropVideoHelper' );

const setAspectRatioHelper = async (
    fileType,
    aspectRatio,
    tempFilePath,
    videoMetadata
) => {
    // set aspect ratio of file
    if (
        fileType !== 6 // if not pdf
        && aspectRatio !== config().supportedAspectRatios[ fileType.toString() ]
      ){
        await cropImageHelper( fileType, tempFilePath, aspectRatio );
        await cropVideoHelper( fileType, tempFilePath, videoMetadata );
  
        let isFileWriten = false;
        while( !isFileWriten ){
          if( fs.existsSync( tempFilePath ) ){
            fileSize = fs.statSync( tempFilePath ).size;
            return fileSize;
          }else{
            //dosya yazılıyor döngüye devam et
          }
        }
      }
}
module.exports = setAspectRatioHelper;
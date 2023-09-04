const Jimp = require('jimp');
const fs = require( 'fs' );

const cleanTempFilesHelper = require( './cleanTempFilesHelper' );

const compressImageHelper = async (
  inputPath,
  quality
) => {
  try{

    const image = await Jimp.read( inputPath );

    await image.quality( quality )
               .write( inputPath );

  }catch( error ){
    await cleanTempFilesHelper( inputPath );
    console.error( 'Görsel sıkıştırma hatası:', error );
  }
}

module.exports = compressImageHelper;
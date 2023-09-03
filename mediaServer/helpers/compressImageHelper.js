const Jimp = require('jimp');
const fs = require( 'fs' );

const compressImageHelper = async (
  inputPath,
  quality
) => {
  try{

    const image = await Jimp.read( inputPath );

    await image.quality( quality )
               .write( inputPath );

  }catch( error ){
    console.error( 'Görsel sıkıştırma hatası:', error );
  }
}

module.exports = compressImageHelper;
const fs = require('fs');
const Jimp = require('jimp');

const writeImageFileAfterProcessHelper = async ( tempFilePath, newPath ) => {
    let image = null;
    while ( image === null ){
      try {
        image = await Jimp.read( tempFilePath );
      }catch( error ){
        // Hata alındı, beklemeye devam edin
      }

      // resim dosyasını yükle
      await image.writeAsync( newPath );

      //temp dosyasını sil
      if( fs.existsSync( tempFilePath ) ){
        fs.unlinkSync( tempFilePath );
      }
    }  
}

module.exports = writeImageFileAfterProcessHelper;
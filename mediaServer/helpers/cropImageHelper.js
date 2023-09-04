const Jimp = require('jimp');
const fs = require( 'fs' );

const cleanTempFilesHelper = require( './cleanTempFilesHelper' );
const config = require( '../config' );

const cropImageHelper = async (
    fileType,
    tempFilePath,
    aspectRatio
) => {

  try{
    if( fileType !== 4 ){ // if not video

      //To Do: Bu yapı çok sık kullanıldı waitHelper ismiyle bir helper yazılabilir
      let image;
      while( !image ){
        if( fs.existsSync( tempFilePath ) ){
          
          image = await Jimp.read( tempFilePath );
        }else{
          //dosya yazılıyor döngüye devam et
        }
      }

      const width = image.bitmap.width;
      const height = image.bitmap.height;

      let newWidth;
      let newHeight;

      if( aspectRatio > config().supportedAspectRatios[ fileType.toString() ] ){
        // olması gerekenden genişse
        newWidth = height * config().supportedAspectRatios[ fileType.toString() ];
      }else if( aspectRatio < config().supportedAspectRatios[ fileType.toString() ] ){
        // olması gerekenden uzunsa
        newHeight = width / config().supportedAspectRatios[ fileType.toString() ];
      }

      let cropX, cropY, cropWidth, cropHeight;

      if( newWidth ){
        //genişlik sabit
        cropX = ( width - newWidth ) / 2;
        cropY = 0;
        cropWidth = newWidth;
        cropHeight = height;
      }else if( newHeight ){
        // boy sabit
        cropX = 0;
        cropY = ( height - newHeight ) / 2;
        cropWidth = width;
        cropHeight = newHeight;
      } else {
        cropX = 0;
        cropY = 0;
        cropWidth = squareSize;
        cropHeight = height;
      }

      await image.crop( cropX, cropY, cropWidth, cropHeight ).write( tempFilePath );

      let resultImage = null;
      while ( resultImage === null ){
        try {
          return resultImage = await Jimp.read( tempFilePath );
        }catch( error ){
          // Hata alındı, beklemeye devam edin
        }
      }
    }
      
  }catch( error ){
    await cleanTempFilesHelper( tempFilePath );
    console.error( 'Görsel işleme hatası:', error );
  }
}

module.exports = cropImageHelper;
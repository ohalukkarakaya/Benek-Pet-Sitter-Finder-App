const Jimp = require('jimp');
const fs = require( 'fs' );

const cropImageHelper = async (
    fileType,
    tempFilePath,
    aspectRatio
) => {

  try{
    if( fileType !== 'video' ){

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
      const squareSize = Math.min( width, height );
      let newWidth;
      let newHeight;

      if(
        fileType === 'cover' 
        && aspectRatio > 4
      ){
        newWidth = height * 4;
      }else if(
        fileType === 'cover' 
        && aspectRatio < 4
      ){
        newHeight = width / 4;
      }

      if(
        fileType == 'storyImage'
        && aspectRatio > 0.5625
      ){
        //yükseklik sabit
        newWidth = height * ( 9 / 16 );
      }else if(
        fileType == 'storyImage'
        && aspectRatio > 0.5625
      ){
        //genişlik sabit
        newHeight = width * ( 9 / 16 );
      }

      let cropX, cropY, cropWidth, cropHeight;

      if( fileType !== 'cover' && fileType !== 'storyImage' ){
        cropX = ( width - squareSize ) / 2;
        cropY = ( height - squareSize ) / 2;
        cropWidth = squareSize;
        cropHeight = squareSize;
      }else{
        if( newWidth ){
          cropX = ( width - newWidth ) / 2;
          cropY = 0;
          cropWidth = newWidth;
          cropHeight = height;
        }else if( newHeight ){
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
    console.error( 'Görsel işleme hatası:', error );
  }
}

module.exports = cropImageHelper;
const Jimp = require('jimp');

const getAspectRatioHelper = async ( filePath ) => {
    try{
        const image = await Jimp.read( filePath );
    
        // Görselin boyutlarını al
        const width = image.bitmap.width;
        const height = image.bitmap.height;
    
        // En-boy oranını hesapla
        const aspectRatio = width / height;
    
        return aspectRatio;
      }catch( error ){
        console.error( 'Görsel okuma hatası:', error );
        throw error; // Hata yeniden fırlatılıyor
      }
}

module.exports = getAspectRatioHelper;
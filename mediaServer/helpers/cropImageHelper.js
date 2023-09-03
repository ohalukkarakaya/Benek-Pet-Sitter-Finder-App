const Jimp = require('jimp');

const cropImageHelper = async (
    fileType,
    tempFilePath,
    aspectRatio
) => {

  try {
      const image = await Jimp.read( tempFilePath );

      const width = image.bitmap.width;
      const height = image.bitmap.height;

      const squareSize = Math.min(width, height);
      let newWidth;
      let newHeight;

      if (fileType === 'cover' && aspectRatio < 4) {
        newWidth = height * 4;
      } else if (fileType === 'cover' && aspectRatio > 4) {
        newHeight = width / 4;
      }

      await image.crop(
        fileType !== 'cover'
          ? (width - squareSize) / 2
          : newWidth
          ? (width - newWidth) / 2
          : 0,

        fileType !== 'cover'
          ? (height - squareSize) / 2
          : newWidth
          ? 0
          : (height - newHeight) / 2,

        fileType !== 'cover'
          ? squareSize
          : newWidth
          ? newWidth
          : height,

        fileType !== 'cover'
          ? squareSize
          : newWidth
          ? height
          : newHeight
      ).write( tempFilePath );

      return await Jimp.read( tempFilePath );;
  } catch (error) {
    console.error('Görsel işleme hatası:', error);
  }
}

module.exports = cropImageHelper;
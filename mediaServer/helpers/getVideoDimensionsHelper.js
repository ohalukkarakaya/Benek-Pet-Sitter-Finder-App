
async function getVideoDimensionsHelper( videoPath, metadata ){
    try{
      
      let width;
      let height;

      for(
        let metaDataStream
        of metadata.streams
      ){
        if(
          metaDataStream.width !== undefined
          && metaDataStream.height !== undefined
        ){
          width = metaDataStream.width;
          height = metaDataStream.height;

          break;
        }
      }
  
      return { width, height };
    }catch( error ){
      throw error;
    }
  }
  

module.exports = getVideoDimensionsHelper;
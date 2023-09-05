const util = require('util');
const fs = require('fs');
const crypto = require('crypto');

// config
const config = require( '../config' );

//helpers
const setAspectRatioHelper = require( '../helpers/uploadEndPointHelpers/setAspectRatioHelper' );
const compressProcessHelper = require( '../helpers/uploadEndPointHelpers/compressProcessHelper' );
const writeImageFileAfterProcessHelper = require( '../helpers/uploadEndPointHelpers/writeImageFileAfterProcessHelper' );
const writeVideoFileAfterProcessHelper = require( '../helpers/uploadEndPointHelpers/writeVideoFileAfterProcessHelper' );
const getMaxFileSizeAndMaxDurationHelper = require( '../helpers/uploadEndPointHelpers/getMaxFileSizeAndMaxDurationHelper' );

const getAspectRatioHelper = require( '../helpers/getAspectRatioHelper' );
const getVideoMetaDataHelper = require( '../helpers/getVideoMetaDataHelper' );
const checkPdfFileHelper = require( '../helpers/checkPdfFileHelper' );
const compressPdfHelper = require( '../helpers/compressPdfHelper' );

const uploadController = async ( req, res ) => {

    const outputPath =  config().outputPathBase 
                            + req.body.outputPath;

    const fileTypeString = req.body.fileType;
    const fileType = config().fileTypeEnums[ fileTypeString ];

    const allowedExtensions = config().supportedExtensions[ fileType.toString() ];

    const fileExtension = req.files
                             .file
                             .name
                             .split( '.' )
                             .pop();

    if(
      !fileType 
      || !allowedExtensions
      || !allowedExtensions.includes( fileExtension )
    ){
      return res.status( 400 )
                .json(
                  { 
                    error: true,
                    false: 'Geçersiz dosya türü.' 
                  }
                );
    }

    const randName = crypto.randomBytes( 10 )
                           .toString( 'hex' );

    // Dosyayı hedef dizine taşı
    const newPath = outputPath + '.' 
                               + fileExtension;

    // Dosya adını silip diri almak için
    const slashPosition = newPath.lastIndexOf( '/' );
    const dirName = newPath.slice( 0, slashPosition );

    let { maxFileSize, maxDuration } = getMaxFileSizeAndMaxDurationHelper( fileType );

    const file = req.files.file;
    let fileSize = parseFloat( file.size );

    const tempFilePath = `temp_${ randName }.${ fileExtension }`;
    await util.promisify( file.mv )( tempFilePath );

    //process pdf
    if( fileType === 6 ){
      const pdfFilter = await checkPdfFileHelper( tempFilePath );
      if(
        pdfFilter
        && pdfFilter.error
      ){
        return res.status( 400 )
                  .json(
                    {
                      error: true,
                      message: "pdf format is setWordSpacing."
                    }
                  );
      }

      if( fileSize > config().maxFileSizes[ fileType.toString() ] ){
        await compressPdfHelper( tempFilePath, fileType, newPath );
      }else{
        const pdfData = await fs.readFile( tempFilePath );
        await fs.writeFile( newPath, pdfData );

        if ( fs.existsSync( tempFilePath ) ){
          fs.unlink(
              tempFilePath, 
              ( err ) => {
                  if( err ){
                      console.error( 'Dosya silinirken hata oluştu:', err );
                  }
              }
          );
        }
      }
    }

    let aspectRatio;
    if( fileType !== 4 && fileType !== 6 ){

      // Get the aspect ratio asynchronously
      aspectRatio = await getAspectRatioHelper( tempFilePath );
    }

    let videoMetadata;
    if( fileType === 4 ){
      videoMetadata = await getVideoMetaDataHelper( tempFilePath );
    }
    

    // crop to wanted aspect ratio and get new files size 
    let setAspectRatioHelperResponse = await setAspectRatioHelper(
                        fileType,
                        aspectRatio,
                        tempFilePath,
                        videoMetadata
                      );

    if( setAspectRatioHelperResponse ){
      fileSize = setAspectRatioHelperResponse;
    }
    
    // compress file and if file is image get new file size
    let compressProcessHelperResponse = await compressProcessHelper(
                                            fileSize,
                                            maxFileSize,
                                            maxDuration,
                                            videoMetadata,
                                            tempFilePath,
                                            fileType
                                         );

    if(
      compressProcessHelperResponse
      && compressProcessHelperResponse.error 
    ){
        return res.status( 400 )
                  .json(
                    compressProcessHelperResponse
                  );
    }
    
    if( compressProcessHelperResponse ){
      fileSize = compressProcessHelperResponse;
    }


    if( fileType !== 4 && fileType !== 6 ){
      // write image file after process
      await writeImageFileAfterProcessHelper( tempFilePath, newPath );
    }else if( fileType !== 6 ){
      // write video file after process
      await writeVideoFileAfterProcessHelper(
        newPath,
        dirName,
        tempFilePath
      );
    }

    //Response Dön
    return res.status( 200 )
              .json(
                { 
                  error: false,
                  message: 'Dosya başarıyla yüklendi.' 
                }
              );
}

module.exports = uploadController;
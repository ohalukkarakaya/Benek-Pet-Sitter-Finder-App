const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Jimp = require('jimp');

const app = express();

const compressImageHelper = require( './helpers/compressImageHelper' );
const cropImageHelper = require( './helpers/cropImageHelper' );
const cropVideoHelper = require( './helpers/cropVideoHelper' );
const getAspectRatioHelper = require( './helpers/getAspectRatioHelper' );
const getVideoMetaDataHelper = require( './helpers/getVideoMetaDataHelper' );
const getVideoDurationHelper = require( './helpers/getVideoDurationHelper.js' );
const compressVideoHelper = require( './helpers/compressVideoHelper' );

// Middleware
app.use( bodyParser.json() );
app.use( fileUpload() );


const ffmpegPath = process.cwd() + '/ffmpeg';

const chmodPromise = util.promisify( fs.chmod );

const ffprobePromise = chmodPromise( ffmpegPath, '777' );

// Upload Endpoint
app.post(
  '/upload', 
  async ( req, res ) => {

    const outputPath = `./assets/${ req.body.outputPath }`;
    const fileType = req.body.fileType;
    const allowedExtensions = [ 'jpg', 'jpeg', 'png', 'mp4', 'JPG', 'JPEG', 'PNG', 'MP4' ];

    const fileExtension = req.files.file.name.split('.').pop();

    if(
      !fileType 
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

    let maxFileSize, maxDuration;

    if( fileType === 'profile' ){
      maxFileSize = 4 * 1024 * 1024; // 4 MB
    }else if( fileType === 'cover' ){
      maxFileSize = 8 * 1024 * 1024; // 8 MB
    }else if( fileType === 'photo' ){
      maxFileSize = 15 * 1024 * 1024; // 15 MB
    }else if( fileType === 'video' ){
      maxFileSize = 0.04 * 1024 * 1024; // 4 MB - test için
      // maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB
      maxDuration = 30; // 30 Sec
    }

    const file = req.files.file;
    let fileSize = parseFloat( file.size );

    const tempFilePath = `temp_${ randName }.${ fileExtension }`;
    await util.promisify( file.mv )( tempFilePath );

    let aspectRatio;
    let videoMetadata
    if( fileType === 'video' ){
      videoMetadata = await getVideoMetaDataHelper( tempFilePath );
    }
    if( fileType !== 'video' ){
      // Get the aspect ratio asynchronously
      aspectRatio = await getAspectRatioHelper( tempFilePath );
    }
    

    if (
      (
        ( fileType === 'profile' || fileType === 'photo' )
        && aspectRatio !== 1
      ) 
      || ( fileType === 'cover' && aspectRatio !== 4 )
      || ( fileType === 'storyImage' && aspectRatio !== 0.5625 )
      || fileType === 'video'
    ){
      await cropImageHelper( fileType, tempFilePath, aspectRatio );
      await cropVideoHelper( fileType, tempFilePath, videoMetadata );

      let isFileWriten = false;
      while( !isFileWriten ){
        if( fs.existsSync( tempFilePath ) ){
          fileSize = fs.statSync( tempFilePath ).size;
          isFileWriten = true;
        }else{
          //dosya yazılıyor döngüye devam et
        }
      }
    }
    
    if( fileSize > parseFloat( maxFileSize ) || maxDuration ){
      try {
        if( maxDuration && fileType === 'video' ){

          const duration = await getVideoDurationHelper( videoMetadata );

          // videosüresi varsayılan süreden uzunsa yüklemeyi iptal et ve hata gönder
          if( duration > maxDuration ){
            if(
              fs.statSync( tempFilePath )
                .isFile()
            ){
  
              fs.unlinkSync( tempFilePath );
  
            }

            return res.status( 400 )
                      .json(
                          { 
                            error: true,
                            message: 'Video süresi sınırı aşıyor.' 
                          }
                        );
          }
          
          await compressVideoHelper( tempFilePath, maxFileSize );
          
        }else{

          for(
            let quality = 50;
            quality >= 10 && fileSize > maxFileSize;
            quality -= 10
          ){
            await compressImageHelper(
              tempFilePath,
              quality
            );
            
            let image = null;
            while ( image === null ){
              try {
                image = await Jimp.read( tempFilePath );
              }catch( error ){
                // Hata alındı, beklemeye devam edin
              }
            }

            if( image ){
              fileSize = await fs.statSync( tempFilePath ).size;
            }
          }

          if( fileSize > maxFileSize ){
              if(
                  fs.statSync( tempFilePath )
                    .isFile()
              ){
                  fs.unlinkSync( tempFilePath );
              }

              return res.status( 400 )
                        .json(
                          {
                            error: true,
                            message: "Image size is too big, please upload smaller image"
                          }
                        );
          }
        }
      }catch( err ){
        console.error( 'Dosya boyutunu düşürme hatası:', err );
        return res.status( 500 )
                  .json(
                      { 
                        error: true,
                        message: 'Dosya boyutunu düşürme sırasında bir hata oluştu.' 
                      }
                   );
      }
    }

    if( fileType !== 'video' ){
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
    }else{

      // eğer dosya zaten varsa sil
      if( fs.existsSync( newPath ) ){

        fs.unlinkSync( newPath );
      }

      //eğer klasör yoksa oluştur
      if( !fs.existsSync( dirName ) ){

        // yeni klasörü oluşturur
        fs.mkdirSync(
          dirName, 
          { recursive: true }
        );
      }

      const isVideoCompressed = fs.existsSync( 'ffmpeg_compress_' + tempFilePath );
      const isVideoCropped = fs.existsSync( 'ffmpeg_' + tempFilePath );

      let pathToProcess = tempFilePath;

      if( isVideoCropped ){

        if( fs.existsSync( tempFilePath ) ){
          fs.unlinkSync( tempFilePath );
        }

        pathToProcess = 'ffmpeg_' + tempFilePath;

      }

      if( isVideoCompressed ){

        if( fs.existsSync( tempFilePath ) ){
          fs.unlinkSync( tempFilePath );
        }

        if( isVideoCropped ){
          fs.unlinkSync( 'ffmpeg_' + tempFilePath )
        }

        pathToProcess = 'ffmpeg_compress_' + tempFilePath;

      }

      await fs.rename(
        pathToProcess,
        newPath, 
        ( err ) => {
            if( err ){
                console.error( 'Dosya adı değiştirme hatası:', err );
            }else{
              if( fs.existsSync( tempFilePath ) ){

                fs.unlinkSync( tempFilePath );
        
              }
            }
        }
      )
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
);

app.get(
    '/getAsset', 
    ( req, res ) => {
        const assetPath = req.query.assetPath;
        console.log( assetPath );
        const assetFilePath = path.join( __dirname, './assets', assetPath ); // assets klasöründe beklenen dosya yolu
    
        
    
        // Dosyayı stream olarak gönder
        const stream = fs.createReadStream( assetFilePath );
        stream.pipe( res );
    }
);

app.delete(
    '/deleteAsset', 
    ( req, res ) => {
        const assetPath = req.query.assetPath;
        const assetFilePath = path.join( __dirname, './assets', assetPath ); // assets klasöründe beklenen dosya yolu
  
        // Dosyanın veya klasörün varlığını kontrol et
        if(
            !fs.existsSync( assetFilePath )
        ){
        return res.status( 200 )
                    .json(
                        { 
                            error: false, 
                            message: 'asset not found' 
                        }
                    );
        }
    
        // Eğer bir dosya ise, dosyayı sil
        if(
            fs.statSync( assetFilePath )
              .isFile()
        ){
        fs.unlinkSync( assetFilePath );
        return res.json(
                        { 
                            error: false,
                            message: 'Dosya başarıyla silindi' 
                        }
                    );
        }
    
        // Eğer bir klasör ise, klasörü ve içeriğini sil
        if (
            fs.statSync( assetFilePath )
              .isDirectory()
        ){
        fs.rmdirSync(
                assetFilePath, 
                { recursive: true }
            );
        return res.json(
                        { 
                            message: 'Klasör ve içeriği başarıyla silindi' 
                        }
                    );
        }
    }
);

// Serveri dinle
const PORT = 3000;
app.listen(
    PORT, 
    () => {
        console.log( `Sunucu ${PORT} portunda çalışıyor.` );
    }
);

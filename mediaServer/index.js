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
    const newPath = __dirname + '/./assets/' 
                              + outputPath 
                              + '.' 
                              + fileExtension;

    let maxFileSize, maxDuration;

    if( fileType === 'profile' ){

      maxFileSize = 0.05 * 1024 * 1024; // 4MB

    }else if( fileType === 'cover' ){

      maxFileSize = 8 * 1024 * 1024; // 8MB

    }else if( fileType === 'photo' ){

      maxFileSize = 15 * 1024 * 1024; // 15MB

    }else if( fileType === 'video' ){

      maxFileSize = 1.5 * 1024 * 1024 * 1024; // 1.5GB
      maxDuration = 30;

    }

    const file = req.files.file;
    let fileSize = parseFloat( file.size );

    const tempFilePath = `temp_${ randName }.${ fileExtension }`;
    await util.promisify( file.mv )( tempFilePath );

    // Get the aspect ratio asynchronously
    const aspectRatio = await getAspectRatioHelper(tempFilePath);

    if (
      ((fileType === 'profile' || fileType === 'photo') && aspectRatio !== 1) ||
      (fileType === 'cover' && aspectRatio !== 4)
    ) {
      await cropImageHelper(fileType, tempFilePath, aspectRatio);
      await cropVideoHelper(fileType, tempFilePath);

      fileSize = fs.statSync( tempFilePath ).size;
    }
    
    if(
      fileSize > parseFloat( maxFileSize )
      || maxDuration
    ){
      try {
        if(
          maxDuration
          && file.mimetype
                 .startsWith( 'video' )
        ){

          const metadata = await ffprobePromise( file.tempFilePath );
          const duration = metadata.format
                                   .duration;

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
          const tempfileSize = fs.statSync( tempFilePath ).size;
          let newBitrate = 1000; // İlk başta kullanılacak varsayılan bitrate değeri (örnek olarak 1000 kbps)

          // Dosyanın boyutunu düşürmek için bitrate değerini dinamik olarak ayarlayın
          while( 
            tempfileSize > parseFloat( maxFileSize ) 
            && newBitrate > 100
          ){
            try {
              await new Promise(
                ( resolve, reject ) => {

                  fs.chmod(
                    process.cwd()+'/ffmpeg', 
                    '777',
                    () => {
                      ffmpeg().input( tempFilePath )
                              .videoBitrate(newBitrate + 'k')
                              .on(
                                'end', 
                                () => {
                                  resolve();
                                }
                              ).on(
                                'error', 
                                ( err ) => {
                                  console.error('ffmpeg hatası:', err);
                                  reject( err );
                                }
                              ).save( 
                                outputPath + '.' 
                                           + fileExtension
                              );
                    }
                  );
                }
              );

              const newFileSize = fs.statSync( outputPath )
                                    .size;

              if( newFileSize >= tempfileSize ){
                newBitrate -= 100;
              }else{
                // Sıkıştırma işlemi dosya boyutunu azalttı, döngüyü sonlandırın
                break;
              }
            }catch( error ){
              console.error( 'Dosya boyutunu düşürme hatası:', error );
              break;
            }
          }

          if(
            fs.statSync( tempFilePath )
              .isFile()
          ){

            fs.unlinkSync( tempFilePath );

          }

          return res.status( 200 )
                    .json( 
                      {
                        error: false,
                        message: "file compressed and uploaded"
                      } 
                    );
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

    let image = null;
    while ( image === null ){
      try {
        image = await Jimp.read( tempFilePath );
      }catch( error ){
        // Hata alındı, beklemeye devam edin
      }
    }
    // Dosyayı yükle
    await image.writeAsync( newPath );

    if(
      fs.statSync( tempFilePath )
        .isFile()
    ){
        fs.unlinkSync( tempFilePath );
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

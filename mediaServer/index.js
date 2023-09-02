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

// Middleware
app.use( bodyParser.json() );
app.use( fileUpload() );


const exec = util.promisify(
                    require( 'child_process' ).exec
                  );

const ffmpegPath = process.cwd() + '/ffmpeg';

const chmodPromise = util.promisify( fs.chmod );

const ffprobePromise = chmodPromise( ffmpegPath, '777' );

const  compressImage = async (
  inputPath, 
  outputPath, 
  quality,
  maxFileSize
) => {
  try {
    const inputImage = await Jimp.read( inputPath );
    let currentQuality = quality;

    while( 
      inputImage.bitmap
                .data
                .length > maxFileSize * 1000 
    ){
      currentQuality -= 10;

      if( currentQuality < 10 ){
        // Minimum kaliteye ulaştık, sıkıştırmayı sonlandır
        break;
      }

      await inputImage.quality( currentQuality );

    }

    await inputImage.writeAsync( outputPath );
  }catch( error ){
    console.error( 'Görsel sıkıştırma hatası:', error );
  }
}

// Upload Endpoint
app.post(
  '/upload', 
  async ( req, res ) => {

    const outputPath = req.body.outputPath;
    const fileType = req.body.fileType;
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'mp4'];

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
    const fileSize = parseFloat( file.size );

    if(
      fileSize > parseFloat( maxFileSize )
      || maxDuration
    ){
      try {
        const tempFilePath = `temp_${ randName }.${ fileExtension }`;
        await util.promisify( file.mv )( tempFilePath );
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
          const quality = 70;

          await compressImage(
            tempFilePath, 
            outputPath + '.' 
                       + fileExtension, 
            quality,
            maxFileSize
          );

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
                        message: "image compressed and uploaded"
                      } 
                    );
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

    // Dosyanın bulunup bulunmadığını kontrol et
    if(
      !fs.existsSync( newPath )
    ){
      try{
        fs.mkdirSync( 
            path.dirname( newPath ), 
            { recursive: true }
        );
        fs.writeFileSync( newPath, '' );
      }catch( err ){
        console.error( 'Dosya oluşturma hatası:', err );
      }
    }

    // Dosyayı yükle
    await util.promisify( file.mv )( newPath );
    

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

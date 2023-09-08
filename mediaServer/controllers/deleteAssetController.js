const fs = require('fs');
const path = require('path');

//hlepers
const config = require( '../config' );

const deleteAssetController = ( req, res ) => {
    const assetPath = req.query.assetPath;

    // assets klasöründe beklenen dosya yolu
    const assetFilePath = path.join( __dirname, '../../assets', assetPath );

    const fileExtension = assetPath.split( '.' )
                                   .pop();

    if(
        assetPath.startsWith( "assets/" )
        || assetPath.includes( "../" )
        || assetPath.includes( "./" )
    ){
          return res.status( 401 )
                    .json(
                      {
                          error: true,
                          message: "wrong path"
                      }
                    );
    }

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
    fs.rmSync(
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

module.exports = deleteAssetController;
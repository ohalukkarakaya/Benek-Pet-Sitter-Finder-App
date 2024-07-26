const fs = require('fs');
const path = require('path');
const config = require( '../config' );

const getAssetController = ( req, res ) => {
    const assetPath = req.query.assetPath;

    const fileExtension = assetPath.split( '.' )
                                   .pop();

    if(
        assetPath.startsWith( "./assets/" )
        || assetPath.startsWith( "../assets/" )
        || assetPath.startsWith( "assets/" )
        || assetPath.includes( "../" )
        || assetPath.includes( "./" )
        || !fileExtension
        || !config().supportedExtensions[ 'all' ].includes( fileExtension )
      ){
          return res.status( 401 ).json({
              error: true,
              message: "wrong path"
          });
      }

    if(
        fileExtension == 'mp4'
        || fileExtension == 'MP4'
        || fileExtension == '.mp4'
        || fileExtension == '.MP4'
    ){
        // Set the correct content type for video
        res.setHeader('Content-Type', 'video/mp4');
    }

    // assets klasöründe beklenen dosya yolu
    const assetFilePath = path.join( __dirname, '../../assets', assetPath );

    

    // Dosyayı stream olarak gönder
    const stream = fs.createReadStream( assetFilePath );
    stream.pipe( res );
}
module.exports = getAssetController;
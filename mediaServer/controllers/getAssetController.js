const fs = require('fs');
const path = require('path');

const getAssetController = ( req, res ) => {
    const assetPath = req.query.assetPath;
    console.log( assetPath );

    // assets klasöründe beklenen dosya yolu
    const assetFilePath = path.join( __dirname, './assets', assetPath );

    

    // Dosyayı stream olarak gönder
    const stream = fs.createReadStream( assetFilePath );
    stream.pipe( res );
}
module.exports = getAssetController;
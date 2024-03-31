const fs = require('fs');
const path = require("path");

const checkFileExistsHelper = async ( fileDir ) => {
    const filePath = path.join( __dirname, '../../assets', fileDir );
    return new Promise(( resolve, reject ) => {
        fs.access( filePath, fs.constants.F_OK, ( err ) => {
            if ( err ){
                resolve( false );
            }else{
                resolve( true );
            }
        });
    });
}

module.exports = checkFileExistsHelper;
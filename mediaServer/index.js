const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

//helper
const auth = require( './miidleWare/auth' );

// Controllers
const uploadController = require( './controllers/uploadController' );
const getAssetController = require( './controllers/getAssetController' );
const deleteAssetController = require( './controllers/deleteAssetController' );
const getVideoThumbnailController = require( './controllers/getVideoThumbnailController' );

// Middleware
app.use( bodyParser.json() );
app.use( fileUpload() );

// asset protection
app.get(
  '/assets/*',
  ( req, res ) => {
    return res.status( 401 )
              .json(
                {
                  error: true,
                  message: "You are not allowed to see assets"
                }
              );
  }
);

// asset protection
app.get(
  '/../assets/*',
  ( req, res ) => {
    return res.status( 401 )
              .json(
                {
                  error: true,
                  message: "You are not allowed to see assets"
                }
              );
  }
);

// Upload Endpoint
app.post(
  '/upload', 
  auth,
  uploadController
);

// Get Asset as Stream End Point
app.get(
    '/getAsset', 
    auth,
    getAssetController
);

// Delete An Asset End Point
app.delete(
    '/deleteAsset', 
    auth,
    deleteAssetController
);
// Get Video Thumbnail End Point
app.get(
    '/getVideoThumbnail',
    auth,
    getVideoThumbnailController
)

// Serveri dinle
const PORT = 3000;
app.listen(
    PORT, 
    () => {
        console.log( `Sunucu ${ PORT } portunda çalışıyor.` );
    }
);

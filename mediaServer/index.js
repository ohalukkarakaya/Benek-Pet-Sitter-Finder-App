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

// Controllers
const uploadController = require( './controllers/uploadController' );
const getAssetController = require( './controllers/getAssetController' );
const deleteAssetController = require( './controllers/deleteAssetController' );

// Middleware
app.use( bodyParser.json() );
app.use( fileUpload() );

// Upload Endpoint
app.post(
  '/upload', 
  uploadController
);

// Get Asset as Stream End Point
app.get(
    '/getAsset', 
    getAssetController
);

// Delete An Asset End Point
app.delete(
    '/deleteAsset', 
    deleteAssetController
);

// Serveri dinle
const PORT = 3000;
app.listen(
    PORT, 
    () => {
        console.log( `Sunucu ${ PORT } portunda çalışıyor.` );
    }
);

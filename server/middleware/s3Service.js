import AWS from "aws-sdk";
import PATH from "path";
import FS from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3Uploadv2 = async (req, res) => {
  const fileStream = new FS.createReadStream(`uploads/${req.newFileName}`);
        
  const endpoint = new AWS.Endpoint(req.regionEndPoint);
  const s3 = new AWS.S3(
      {
          endpoint: endpoint,
          credentials: {
              accessKeyId: process.env.IDRIVE_ACCESS_KEY,
              secretAccessKey: process.env.IDRIVE_SECRET_ACCESS_KEY
            } 
      }
  );

  var params = {
      Bucket: process.env.IDRIVE_PROFILE_IMG_BUCKET_NAME,
      Key: req.newFileName,
      Body: fileStream
  };

  AWS.config.update({
      region: 'MY_REGION',
      apiVersion: 'latest',
      credentials: {
        accessKeyId: 'MY_ACCESS_KEY',
        secretAccessKey: 'MY_SECRET_KEY'
      }
    })

  s3.putObject(params, function(err, data) {
    if(err){
      return res.status(500).json({
          error: true,
          message: err.message
      });
    }else{
      req.uploadedData = data;
      res.status(200).json(
          {
              error: false,
              iDriveId: req.uploadedData,
              objectName: req.newFileName
          }
      );
    }
  });
};

export default s3Uploadv2;
import AWS from "aws-sdk";
import FS from "fs";
import dotenv from "dotenv";
import { promisify } from "util";

dotenv.config();

const unlinkAsync = promisify(FS.unlink);

const s3Upload = async (req, res) => {

  const filePath = `s3UploadBridge/${req.newFileName}`;
  const endpoint = new AWS.Endpoint(req.regionEndPoint);
  const fileStream = new FS.createReadStream(filePath);

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

  s3.putObject(params, function(err, data) {
    if(err){
      return res.status(500).json({
          error: true,
          message: err.message
      });
    }else{
      req.uploadedData = data;
      unlinkAsync(filePath).then(
        (val) => {
          var getImgParams = {
            Bucket: process.env.IDRIVE_PROFILE_IMG_BUCKET_NAME,
            Key: req.newFileName,
          };

          s3.headObject(getImgParams, function(err, responseData){
            if (err) {
              return res.status(500).json(
                {
                  error: true,
                  message: err
                }
              );
            } else {
              return res.status(200).json(
                {
                  error: false,
                  iDriveId: req.uploadedData,
                  objectName: req.newFileName,
                  data: responseData
                }
              );
            }
          });
        }
      );
    }
  });
};

export default s3Upload;
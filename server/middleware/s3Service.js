import AWS from "aws-sdk";
import PATH from "path";
import FS from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3Uploadv2 = async (file, req, res, next) => {
    const fileStream = new FS.createReadStream(file);

    const endpoint = new AWS.Endpoint(req.regionEndPoint);
    const s3 = new AWS.S3(
        {
            endpoint: endpoint
        }
    );
    
    const { originalname } = file;
    const userId = req.user._id;

    console.log(process.env.IDRIVE_PROFİLE_IMG_BUCKET_NAME,);

    var params = {
        Bucket: process.env.IDRIVE_PROFİLE_IMG_BUCKET_NAME,
        Key: `profile-${userId}.${originalname.split(".")[1]}`,
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
        console.log(data);
        next();
      }
    });
};

export default s3Uploadv2;
import aws from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();
const s3 = new aws.S3(
    {
        forcePathStyle: true,
        endpoint: process.env.S3_ENDPOINT,
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
);

//Storage
const storage = multerS3(
    {
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        key: (req, profileImg, cb) => {
            const { originalname } = profileImg;
            const userId = req.user._id;
            const newFileName = `profile-${userId}.${originalname.split(".")[1]}`;
            req.newFileName = newFileName;
            console.log("profileImages/"+newFileName);
            cb(null, "profileImages/"+newFileName);
        }
    }
);

//File Filter
const fileFilter = (req, profileImg, cb) => {
    if(profileImg.mimetype === 'image/jpeg'){
        cb( null, true );
    }else{
        cb( new Error("You can just upload '.jpg"), false );
    }
};

const upload = multer(
    {
        storage: storage,
        fileFilter,
        limits: { fileSize: 1000000 }

    }
);

export { upload, s3 };
import aws from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import User from "../models/User.js";

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
            console.log(profileImg);
            const { originalname } = profileImg;
            const userId = req.user._id;
            const newFileName = `${userId}_profileImg.${originalname.split(".")[1]}`;
            req.newFileName = newFileName;
            cb(null, "profileAssets/"+userId+"/"+newFileName);
        }
    }
);

//File Filter
const fileFilter = (req, profileImg, cb) => {
    if(profileImg){
        if(profileImg.mimetype === 'image/jpeg'){
            cb( null, true );
        }else{
            cb( new Error("You can just upload '.jpg"), false );
        }
    }
};

const upload = multer(
    {
        storage: storage,
        fileFilter,
        limits: { fileSize: 1000000 }

    }
);

const deleteImg = async (deleteParams) => {
    try {
      await s3.deleteObject(deleteParams).promise();
      console.log("Success", data);
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  };

const updateProfileImg = async (req, res, next) => {
    try{
        const userId = req.user._id;
            User.findOne(
                { _id: userId},
                (err, user) => {
                    const isDefaultImg = user.profileImg.isDefaultImg;
                    if(isDefaultImg){
                            upload.single("profileImg")(req, {}, (err) => {
                                if(req.file){
                                    User.findOneAndUpdate(
                                        { _id: userId },
                                        {
                                            "profileImg.imgUrl": req.file.location,
                                            "profileImg.recordedImgName": req.newFileName,
                                            "profileImg.isDefaultImg": false,
                                        },
                                        {
                                            new: true,
                                            upsert: true,
                                        },
                                        (err, updated) => {
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log("profile image updated");
                                            }
                                        }
                                    );
                                    next();
                                }else{
                                    next();
                                }
                            });
                    }else{
                        const deleteParam = {
                            Bucket: process.env.BUCKET_NAME,
                            Key: `profileAssets/${userId}/${user.profileImg.recordedImgName}`
                        };
                        Promise.resolve(
                            deleteImg(deleteParam)
                        ).then(
                            (_) => {
                                console.log("ready to upload");
                                upload.single("profileImg")(req, {}, (err) => {
                                    console.log(req.file);
                                    if(req.file){
                                        User.findOneAndUpdate(
                                            { _id: userId },
                                            {
                                                "profileImg.imgUrl": req.file.location,
                                                "profileImg.recordedImgName": req.newFileName,
                                                "profileImg.isDefaultImg": false,
                                            },
                                            {
                                                new: true,
                                                upsert: true,
                                            },
                                            (err, updated) => {
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    console.log("Old image deleted and new one inserted");
                                                }
                                            }
                                        );
                                        next();
                                    }else{
                                        next();
                                    }
                                });
                            }
                        )
                    }
                }
            );
    }catch(err){
        return res.status(500).json(
            {
                error: true,
                message: err.message
            }
        )
    }
    
} 

export { updateProfileImg, s3 };
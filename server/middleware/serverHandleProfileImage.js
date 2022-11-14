import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import User from "../models/User.js";
import s3 from "../utils/s3Service.js";
dotenv.config();

//Storage
const storage = multerS3(
    {
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => {
            
            console.log(file.fieldname);
            const { originalname } = file;
            const userId = req.user._id;

            if(file.fieldname == "profileImg"){
                const newFileName = `${userId}_profileImg.${originalname.split(".")[1]}`;
                req.profileImgNewFileName = newFileName;
                
                cb(null, "profileAssets/"+userId+"/"+newFileName);

            }else if(file.fieldname == "coverImg"){
                const newFileName = `${userId}_coverImg.${originalname.split(".")[1]}`;
                req.coverImgNewFileName = newFileName;
                
                cb(null, "profileAssets/"+userId+"/"+newFileName);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'image/jpeg'){
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

const deleteImg = async (req, file, deleteParams) => {
    try {
        fileFilter.then(
            (_) => {
                s3.deleteObject(deleteParams).promise();
                console.log("Success", data);
                return data;
            }
        );
    } catch (err) {
        console.log("Error", err);
    }
  };

const ValidateAndCleanBucket = async (
    req,
    user,
    isDefaultProfileImg,
    isDefaultCoverImg,
    recordedImgName
) => {
    if(!isDefaultProfileImg && user.profileImg.recordedImgName !== undefined){
        const deleteProfileImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profileAssets/${user._id}/${recordedImgName}`
        };
        await deleteImg(deleteProfileImageParams);
    }
    if(!isDefaultCoverImg && user.coverImg.recordedImgName !== undefined){
        const deleteCoverImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profileAssets/${user._id}/${recordedImgName}`
        };
        await deleteImg(deleteCoverImageParams);
    }
}

const updateProfileImg = async (req, res, next) => {
    try{
        const userId = req.user._id;
            User.findOne(
                { _id: userId},
                (err, user) => {
                    const isDefaultProfileImg = user.profileImg.isDefaultImg;
                    const isDefaultCoverImg = user.coverImg.isDefaultImg;
                    ValidateAndCleanBucket(
                        req,
                        isDefaultProfileImg,
                        isDefaultCoverImg,
                        user.profileImg.recordedImgName
                    ).then(
                        (_) => {
                            upload.fields(
                                [
                                    {
                                        name: "profileImg",
                                        maxCount: 1
                                    },
                                    {
                                        name: "coverImg",
                                        maxCount: 1
                                    }
                                ]
                            )(
                                req,
                                {},
                                (err) => {
                                    if(req.files.profileImg || req.files.coverImg){
                                        let updateParams;
                                        if(req.files.profileImg && req.files.coverImg){
                                            updateParams = {
                                                "profileImg.imgUrl": req.files.profileImg[0].location,
                                                "profileImg.recordedImgName": req.profileImgNewFileName,
                                                "profileImg.isDefaultImg": false,
                                                "coverImg.imgUrl": req.files.coverImg[0].location,
                                                "coverImg.recordedImgName": req.coverImgNewFileName,
                                                "coverImg.isDefaultImg": false,
                                            }
                                        }else if(req.files.profileImg && !req.files.coverImg){
                                            updateParams = {
                                                "profileImg.imgUrl": req.files.profileImg[0].location,
                                                "profileImg.recordedImgName": req.profileImgNewFileName,
                                                "profileImg.isDefaultImg": false,
                                            }
                                        }else if(!req.files.profileImg && req.files.coverImg){
                                            updateParams = {
                                                "coverImg.imgUrl": req.files.coverImg[0].location,
                                                "coverImg.recordedImgName": req.coverImgNewFileName,
                                                "coverImg.isDefaultImg": false,
                                            }
                                        }

                                        User.findOneAndUpdate(
                                            { _id: userId },
                                            updateParams,
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
                            }
                        )
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

    export { updateProfileImg };
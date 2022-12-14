import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import User from "../../models/User.js";
import s3 from "../../utils/s3Service.js";
dotenv.config();

//Storage
const storage = multerS3(
    {
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        contentType: ( req, file, cb ) => {
            try{
                const fileType = file.mimetype;
                cb(null, fileType);
            }catch(err){
                console.log(err);
            }
        },
        key: (req, file, cb) => {
            
            console.log(file.fieldname);
            const { originalname } = file;
            const userId = req.user._id;

            const splitedOriginalName = originalname.split(".");

            if(file.fieldname == "profileImg"){
                const newFileName = `${userId}_profileImg.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.profileImgNewFileName = newFileName;
                req.profileCdnPath = `${process.env.CDN_SUBDOMAIN}profileAssets/${userId}/${newFileName}`;
                
                cb(null, "profileAssets/"+userId+"/"+newFileName);

            }else if(file.fieldname == "coverImg"){
                const newFileName = `${userId}_coverImg.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.coverImgNewFileName = newFileName;
                req.coverCdnPath = `${process.env.CDN_SUBDOMAIN}profileAssets/${userId}/${newFileName}`;
                
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
    if(!isDefaultProfileImg && user.profileImg !== undefined && user.profileImg.recordedImgName !== undefined){
        const deleteProfileImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profileAssets/${user._id}/${recordedImgName}`
        };
        await deleteImg(deleteProfileImageParams);
    }
    if(!isDefaultCoverImg && user.coverImg !== undefined && user.coverImg.recordedImgName !== undefined){
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
            await User.findOne(
                { _id: userId},
                (err, user) => {
                    req.user = user;
                    const isDefaultProfileImg = user.profileImg.isDefaultImg;
                    const isDefaultCoverImg = user.coverImg.isDefaultImg;
                    ValidateAndCleanBucket(
                        req,
                        isDefaultProfileImg,
                        isDefaultCoverImg,
                        user.profileImg.recordedImgName,
                        user.coverImg.recordedImgName
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
                                    if(req.files !== undefined && req.files.profileImg || req.files !== undefined && req.files.coverImg){
                                        let updateParams;
                                        if(req.files.profileImg && req.files.coverImg){
                                                //if there is profile image and cover image both
                                                req.user.profileImg.imgUrl = req.profileCdnPath;
                                                req.user.profileImg.recordedImgName = req.profileImgNewFileName;
                                                req.user.profileImg.isDefaultImg = false;
                                                req.user.coverImg.imgUrl = req.coverCdnPath;
                                                req.user.coverImg.recordedImgName = req.coverImgNewFileName;
                                                req.user.coverImg.isDefaultImg = false;

                                        }else if(req.files.profileImg && !req.files.coverImg){
                                                //if there is only profile image
                                                req.user.profileImg.imgUrl = req.profileCdnPath;
                                                req.user.profileImg.recordedImgName = req.profileImgNewFileName;
                                                req.user.profileImg.isDefaultImg = false;

                                        }else if(!req.files.profileImg && req.files.coverImg){
                                                //if there is only cover image
                                                req.user.coverImg.imgUrl= req.coverCdnPath;
                                                req.user.coverImg.recordedImgName = req.coverImgNewFileName;
                                                req.user.coverImg.isDefaultImg = false;
                                        }
                                        next();
                                    }else{
                                        next();
                                    }
                                });
                            }
                        )
                    }
                ).clone();
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
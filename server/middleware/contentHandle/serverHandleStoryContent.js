import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
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
            try{
                const { originalname } = file;
                const userId = req.user._id;

                const imageId = `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
                const splitedOriginalName = originalname.split(".");
                const newFileName = `story_${userId}_${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.petProfileImgNewFileName = newFileName;
                req.cdnUrl = `${process.env.CDN_SUBDOMAIN}profileAssets/${userId.toString()}/story/${newFileName}`;
                
                cb(null, "profileAssets/"+userId.toString()+"/story/"+newFileName);

            }catch(err){
                console.log(err);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4'){
            cb( null, true );
        }else{
            cb( new Error('You can just upload ".jpg" or ".mp4"'), false );
        }
    }else{
        cb( new Error('content is required'), false );
    }
};

//Upload Function
const upload = multer(
    {
        storage: storage,
        fileFilter
    }
);

//Upload File
const uploadStory = async (req, res, next) => {
    try{
        upload.single( 'file' )(
            req,
            {},
            (error) => {
                if(error){
                    console.log("error", error);
                    return res.status(500).json(
                        {
                            error: true,
                            errorData: error,
                            message: "A problem occured wile uploading story"
                        }
                    );
                }
                next();
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

    export { uploadStory };
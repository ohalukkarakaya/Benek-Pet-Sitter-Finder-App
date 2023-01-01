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
                const missionId = req.missionId;
                const careGiveId = req.careGiveId;

                const imageId = `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
                const splitedOriginalName = originalname.split(".");
                const newFileName = `MissionContent_${missionId}_${careGiveId}_${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.missionContent = newFileName;
                req.cdnUrl = `${process.env.CDN_SUBDOMAIN}careGive/${careGiveId.toString()}/${newFileName}`;
                
                cb(null, "careGive/"+careGiveId.toString()+"/"+newFileName);

            }catch(err){
                console.log(err);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'video/mp4'){
            cb( null, true );
        }else{
            cb( new Error('You can just upload ".mp4"'), false );
        }
    }else{
        cb( new Error('content is required'), false );
    }
};

//Upload Function
const upload = multer(
    {
        storage: storage,
        fileFilter,
    }
);

const deleteContent = async (req, file, deleteParams) => {
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
    areThereContentAlready,
    contentName
) => {
    if(areThereContentAlready){
        const deleteMissionContentParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `careGive/${req.careGiveId.toString()}/${contentName}`
        };
        await deleteContent(deleteMissionContentParams);
    }
}

//Upload File
const uploadMissionContent = async (req, res, next) => {
    try{
        const areThereContentAlready = req.mission.missionContent.videoUrl;

        const splitedVideoUrl = req.mission.missionContent.videoUrl.split("/");
        const contentName = splitedVideoUrl[splitedVideoUrl.length - 1];

        ValidateAndCleanBucket(
            req,
            areThereContentAlready,
            contentName
        ).then(
            (_) => {
                upload.single( 'file' )(
                    req,
                    {},
                    (error) => {
                        if(error){
                            console.log("error", error);
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "A problem occured wile uploading content"
                                }
                            );
                        }
                        next();
                    }
                );
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

    export { uploadMissionContent };
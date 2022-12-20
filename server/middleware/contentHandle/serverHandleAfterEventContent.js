import multer from "multer";
import multerS3 from "multer-s3";
import Event from "../../models/Event/Event.js";
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
                const newFileName = `eventContent_${eventId}_${userId}_${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.eventContent = newFileName;
                req.cdnUrl = `${process.env.CDN_SUBDOMAIN}events/${eventId.toString()}/afterEventContents/${newFileName}`;
                
                cb(null, "events/"+eventId.toString()+"/afterEventContents/"+newFileName);

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

const ValidateAndCleanBucket = async ( req ) => {
    if(req.imgName){
        const deleteProfileImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `events/${req.eventId.toString()}/afterEventContents/${req.imgName}`
        };
        await deleteImg(deleteProfileImageParams);
    }
}

//Upload File
const uploadEventContent = async (req, res, next) => {
    try{
        const contentId = req.params.contentId;
        const isEditing = contentId;

        req.meetingEvent = await Event.findById(req.params.eventId);
        if(!req.meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        if(isEditing){
            req.content = req.meetingEvent.afterEvent.find(
                contentObject =>
                    contentObject._id.toString() === contentId
            );

            if(req.content.isUrl){
                const splitedImgUrl = req.content.value.split("/");
                req.imgName = splitedImgUrl[splitedImgUrl.length -1];
            }
        }

        ValidateAndCleanBucket(req).then(
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
                                    errorData: error,
                                    message: "A problem occured wile uploading story"
                                }
                            );
                        }
                        if(isEditing){
                            req.content.isUrl = false;
                            req.content.value = null;
                        };
                        next();
                    }
                );
            }
        ).catch(
            (err) => {
                console.log(err);
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal server error"
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

    export { uploadEventContent };
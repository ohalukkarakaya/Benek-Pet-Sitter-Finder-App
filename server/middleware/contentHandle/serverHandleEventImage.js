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
                const newFileName = `event_${req.eventId}_${userId}_${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.petProfileImgNewFileName = newFileName;
                req.cdnUrl = `${process.env.CDN_SUBDOMAIN}events/${req.eventId.toString()}/${newFileName}`;
                
                cb(null, "events/"+req.eventId.toString()+"/"+newFileName);

            }catch(err){
                console.log(err);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
            cb( null, true );
        }else{
            cb( new Error('You can just upload ".jpg"'), false );
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

const ValidateAndCleanBucket = async (
    req,
    areThereImgAlready,
    ImgName
) => {
    if(areThereImgAlready){
        const deleteProfileImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `events/${req.eventId.toString()}/${ImgName}`
        };
        await deleteImg(deleteProfileImageParams);
    }
}

//Upload File
const uploadEventImage = async (req, res, next) => {
    try{
        req.eventId = req.params.eventId;
        req.meetingEvent = await Event.findById(req.eventId);
        if(!req.meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        const isEventAdmin = req.meetingEvent.eventAdmin.toString() === req.user._id.toString();
        if(!isEventAdmin){
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not allowed to edit this event"
                }
            );
        }

        const meetingDate = Date.parse(req.meetingEvent.date);
        if(meetingDate <= Date.now()){
            return res.status(400).json(
                {
                    error: true,
                    message: "too late to edit this event"
                }
            );
        }

        const areThereImgAlready = req.meetingEvent.imgUrl;
        
        const splitedImgUrl = req.meetingEvent.imgUrl.split("/");
        const ImgName = splitedImgUrl[splitedImgUrl.length - 1];

        ValidateAndCleanBucket(
            req,
            areThereImgAlready,
            ImgName
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
                                    errorData: error,
                                    message: "A problem occured wile uploading story"
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

    export { uploadEventImage };
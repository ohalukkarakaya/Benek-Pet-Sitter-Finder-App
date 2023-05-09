import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import Chat from "../../models/Chat/Chat.js";
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
            const chatId = req.chat._id.toString();

            const splitedOriginalName = originalname.split(".");

            if(file.fieldname === "file"){
                const uniqueRandName = crypto.randomBytes(6).toString('hex');
                const newFileName = `${chatId}_${uniqueRandName}_chatFile.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.chatFileName = newFileName;
                req.chatFileCdnPath = `${process.env.CDN_SUBDOMAIN}chatAssets/${chatId}/chatFile/${newFileName}`;
                
                cb(null, "chatAssets/"+chatId+"/chatFile/"+newFileName);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if( file ){
        if(
            file.mimetype === 'image/jpeg'
            || file.mimetype === 'image/jpg'
            || file.mimetype === 'image/png'
            || file.mimetype === 'image/gif'
            || file.mimetype === 'video/mp4'
            || file.mimetype == "audio/mp4a-latm"
            || file.mimetype == "audio/mpeg"
        ){
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

const uploadChatFile = async ( req, res, next ) => {
    try{
        const userId = req.user._id.toString();
        const chatId = req.params.chatId;
        if( req.body.messageType.toString() === "File" ){ 
            await Chat.findOne(
                { 
                    _id: chatId,
                },
                (err, chat) => {
                    if( err ){
                        console.log(err);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                        );
                    }

                    const isUserMember = chat.mambers.filter(
                        member => 
                            member.userId.toString() === userId
                    );
                    if( !isUserMember ){
                        return res.status(401).json(
                            {
                                error: true,
                                message: "you cant share file for this chat"
                            }
                        );
                    }

                    req.chat = chat;
                    upload.fields(
                        [
                            {
                                name: "file",
                                maxCount: 1
                            }
                        ]
                    )(
                        req,
                        {},
                        (err) => {
                            if( err ){
                                console.log(err);
                                return res.status(500).json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                            }
                            if( 
                                req.chatFileName != undefined 
                                && req.chatFileName
                                && req.chatFileCdnPath !== undefined 
                                && req.chatFileCdnPath 
                            ){
                                next();
                            }else{
                                next();
                            }
                        }
                    );
                }
            ).clone();
        }else{
            next();
        }
    }catch(err){
        return res.status(500).json(
            {
                error: true,
                message: err.message
            }
        )
    }
} 

    export { uploadChatFile };
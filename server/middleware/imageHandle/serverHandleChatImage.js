import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import Chat from "../../models/Chat.js";
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

            if(file.fieldname === "chatImage"){
                const newFileName = `${chatId}_chatImageImg.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.chatNewFileName = newFileName;
                req.chatImageCdnPath = `${process.env.CDN_SUBDOMAIN}profileAssets/${chatId}/${newFileName}`;
                
                cb(null, "chatAssets/"+chatId+"/"+newFileName);
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
    chat,
    areThereChatImg
) => {
    if( areThereChatImg && chat.chatImageUrl !== undefined ){
        const deleteChatImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: chat.chatImageUrl
        };
        await deleteImg( deleteChatImageParams );
    }
}

const updateChatImg = async ( req, res, next ) => {
    try{
        const userId = req.user._id.toString();
        const chatId = req.params.chatId;
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

                    const isUserMember = chat.mambers.where(
                        member => 
                            member.userId.toString() === userId
                    );
                    if( !isUserMember ){
                        return res.status(401).json(
                            {
                                error: true,
                                message: "you cant upload image for this user"
                            }
                        );
                    }

                    req.chat = chat;
                    const areThereChatImg = chat.chatImageUrl;
                    ValidateAndCleanBucket(
                        chat,
                        areThereChatImg,
                    ).then(
                        (_) => {
                            upload.fields(
                                [
                                    {
                                        name: "chatImage",
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
                                    if( req.chatImageCdnPath !== undefined && req.chatImageCdnPath ){
                                        chat.chatImageUrl = req.chatImageCdnPath;

                                        chat.save(
                                            function (err) {
                                              if(err) {
                                                  console.error('ERROR: While Update image!');
                                              }
                                            }
                                        );

                                        return res.status(200).json(
                                            {
                                                error: false,
                                                imageUrl: req.chatImageCdnPath,
                                                message: "image uploaded successfully"
                                            }
                                        );
                                    }else{
                                        return res.status(500).json(
                                            {
                                                error: true,
                                                message: "image couldn't uploaded"
                                            }
                                        );
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

    export { updateChatImg };
import Event from "../../models/Event/Event.js";
import User from "../../models/User.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const serverHandleEventImageHelper = async ( req, res, next ) => {
    try{
        upload.single( 'file' )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: serverHandleEventImageHelper - ", err );
                    return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
                }

                const fileType = req.file.mimetype;
                if( fileType !== 'image/jpeg' && fileType !== 'image/jpg' ){
                    return res.status( 400 ).json({ error: true, message: "Wrong File Format" });
                }

                const fileTypeEnum = "horizontalPhoto";

                const eventId = req.params.eventId.toString();
                req.meetingEvent = await Event.findById( eventId );

                const user = await User.findById( req.meetingEvent.eventAdmin );
                if( !user || user.deactivation.isDeactive ){
                    return res.status( 401 ).json({ error: true, message: "Un Authorized" });
                }

                if( req.meetingEvent.imgUrl ){
                    const deleteExistingImage = await deleteFileHelper( req.meetingEvent.imgUrl );
                    if( deleteExistingImage.error ){
                        return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
                    }
                }

                //insert outputpath
                const { originalname } = req.file;
                const splitedOriginalName = originalname.split( "." );
                const randId = crypto.randomBytes( 6 ).toString( 'hex' );

                const newFileName =  eventId + "_" + randId + "_event";
                req.eventImageFileName = newFileName;

                const pathToSend =  "events/" + req.params.eventId.toString() + "/" + newFileName;
                req.eventImagePath = pathToSend + "." + splitedOriginalName[ splitedOriginalName.length - 1 ];

                try{
                    await fs.promises.writeFile(
                        newFileName + "." + splitedOriginalName[ splitedOriginalName.length - 1 ],
                        req.file.buffer,
                        "binary"
                    );
                }catch( err ){
                    console.error( "Dosya yazma hatası:", err );
                }

                const writenFile = fs.createReadStream( newFileName + "." + splitedOriginalName[ splitedOriginalName.length - 1 ] );

                const uploadEventImage = await uploadFileHelper(
                    writenFile,
                    newFileName + "." + splitedOriginalName[ splitedOriginalName.length - 1 ],
                    fileTypeEnum,
                    pathToSend,
                    res
                );

                fs.rmSync( newFileName + "." + splitedOriginalName[ splitedOriginalName.length - 1 ] );
                if( uploadEventImage.error ){
                    return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
                }
                next();
            }
        );
        

    }catch( err ){
        console.log( "ERROR: serverHandleEventImageHelper - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal server error" });
    }
}

export default serverHandleEventImageHelper;
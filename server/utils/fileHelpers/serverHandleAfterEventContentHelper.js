import Event from "../../models/Event/Event.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const serverHandleAfterEventContentHelper = async ( req, res, next ) => {
    try{
        upload.single( 'file' )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: serverHandleAfterEventContentHelper - ", err );
                    return res.status( 500 )
                              .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                              );
                }

                const contentId = req.params.contentId;
                const isEditing = contentId;

                if( isEditing ){
                    req.content = req.meetingEvent.afterEvent.find(
                        contentObject =>
                            contentObject._id.toString() === contentId
                    );
        
                    if( req.content.isUrl ){
                        req.existingImageUrl = req.content.value;
                    }
                }

                if( req.existingImageUrl ){
                    const deleteExistingImage = await deleteFileHelper( req.existingImageUrl );
                    if( deleteExistingImage.error ){
                        return res.status( 500 )
                                  .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                  );
                    }
                }

                const eventId = req.params.eventId.toString();
                const userId = req.user._id.toString();

                req.meetingEvent = await Event.findById( eventId );

                if( req.file ){
                    const fileType = req.file.mimetype;
                    if(
                        fileType !== 'image/jpeg' 
                        && fileType !== 'image/jpg' 
                        && fileType !== 'video/mp4'
                    ){
                        return res.status( 400 )
                                  .json(
                                      {
                                        error: true,
                                        message: "Wrong File Format"
                                      }
                                   );
                    }

                    const isFileVideo = fileType === 'video/mp4';

                    const fileTypeEnum = isFileVideo
                                            ? "horizontalVideo"
                                            : "horizontalPhoto";

                    if(
                        !req.meetingEvent
                        || !( 
                            req.meetingEvent.joined.includes( userId ) 
                        )
                    ){
                        return res.status( 401 )
                                  .json(
                                      {
                                          error: true,
                                          message: "Un Authorized"
                                      }
                                   );
                    }

                    //insert outputpath
                    const { originalname } = req.file;
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 )
                                         .toString( 'hex' );

                    const newFileName =  eventId + "_"
                                                 + randId 
                                                 + "_eventContent";

                    req.afterEventContentFileName = newFileName;

                    const pathToSend =  "events/" + eventId
                                                  + "/"
                                                  + newFileName;

                    req.afterEventContentPath = pathToSend + "."
                                                           + splitedOriginalName[
                                                                splitedOriginalName.length - 1
                                                             ];

                    try {
                        await fs.promises.writeFile(
                            newFileName + "."
                                        + splitedOriginalName[
                                            splitedOriginalName.length - 1
                                          ],
                            req.file.buffer,
                            "binary"
                        );
                    }catch( err ){
                        console.error( "Dosya yazma hatası:", err );
                    }

                    const writenFile = fs.createReadStream( 
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ] 
                                            );

                    const uploadAfterEventContent = await uploadFileHelper(
                                                        writenFile,
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ],
                                                        fileTypeEnum,
                                                        pathToSend,
                                                        res
                                                    );

                    fs.rmSync( 
                        newFileName + "."
                                    + splitedOriginalName[
                                        splitedOriginalName.length - 1
                                      ] 
                        );

                    if( uploadAfterEventContent.error ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                 );
                    }
                }

                next();
            }
        );
        

    }catch( err ){
        console.log( "ERROR: serverHandleAfterEventContentHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default serverHandleAfterEventContentHelper;
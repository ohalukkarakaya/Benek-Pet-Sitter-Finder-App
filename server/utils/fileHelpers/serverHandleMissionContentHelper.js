import User from "../../models/User.js";

import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const serverHandleMissionContentHelper = async ( req, res, next ) => {
    try{
        upload.single( 'file' )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: serverHandleMissionContentHelper - ", err );
                    return res.status( 500 )
                              .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                              );
                }

                const fileType = req.file.mimetype;
                if( fileType !== 'video/mp4' ){
                    return res.status( 400 )
                              .json(
                                {
                                    error: true,
                                    message: "Wrong File Format"
                                }
                              );
                }

                const fileTypeEnum = "video"
                const userId = req.user._id.toString();
                req.user = await User.findById( userId );

                //insert outputpath
                const { originalname } = req.file;
                const splitedOriginalName = originalname.split( "." );
                const newFileName =  req.careGiveId + "_"
                                                    + req.missionId 
                                                    + "_MissionContent";

                req.missionFileName = newFileName;

                const pathToSend =  "CareGive/" + req.careGiveId
                                                + "/"
                                                + newFileName;

                req.missionFilePath = pathToSend + "."
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

                const uploadMission = await uploadFileHelper(
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

                if( uploadMission.error ){
                    return res.status( 500 )
                            .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                            );
                }

                next();
            }
        );
        

    }catch( err ){
        console.log( "ERROR: serverHandleMissionContentHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default serverHandleMissionContentHelper;
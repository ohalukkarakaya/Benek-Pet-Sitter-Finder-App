import User from "../../models/User.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadProfileAssetsHelper = async ( req, res, next ) => {
    try{
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
            async ( err ) => {
                const userId = req.user._id.toString();
                req.user = await User.findById( userId );

                const user = req.user;

                const isDefaultProfileImg = user.profileImg.isDefaultImg;
                const isDefaultCoverImg = user.coverImg.isDefaultImg;

                //clean existing profile image from server
                if(
                    user.profileImg.imgUrl !== null
                    && user.profileImg.imgUrl !== ""
                    && !isDefaultProfileImg
                    && req.files !== undefined
                    && req.files
                          .profileImg !== undefined
                    && req.files
                          .profileImg[ 0 ]
                ){
                    const deleteExistingImage = await deleteFileHelper( user.profileImg.imgUrl );
                    if( deleteExistingImage.err ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                //clean existing coverImage from server
                if(
                    user.coverImg.imgUrl !== null
                    && user.coverImg.imgUrl !== ""
                    && !isDefaultCoverImg
                    && req.files !== undefined
                    && req.files
                          .coverImg !== undefined
                    && req.files
                          .coverImg[ 0 ]
                ){
                    const deleteExistingImage = await deleteFileHelper( user.coverImg.imgUrl );
                    if( deleteExistingImage.err ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                if( req.files.profileImg ){

                    //insert outputpath
                    const { originalname } = req.files.profileImg[ 0 ];
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 )
                                         .toString( 'hex' );

                    const newFileName = userId + "_" 
                                            + randId 
                                            + "_profileImg";

                    req.profileImgNewFileName = newFileName;

                    const pathToSend =  "profileAssets/" + userId
                                                         + "/"
                                                         + newFileName;

                    req.profilePath = pathToSend + "."
                                                 + splitedOriginalName[
                                                     splitedOriginalName.length - 1
                                                   ];

                    try {
                        await fs.promises.writeFile(
                            newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1],
                            req.files.profileImg[0].buffer,
                            "binary"
                        );
                        console.log("Dosya yazma başarılı");
                    } catch (err) {
                        console.error("Dosya yazma hatası:", err);
                    }

                    const writenFile = fs.createReadStream( 
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ] 
                                          );

                    const uploadProfileImage = await uploadFileHelper(
                                                        writenFile,
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ],
                                                        'profile',
                                                        pathToSend,
                                                        res
                                                    );

                    fs.rmSync( 
                        newFileName + "."
                                    + splitedOriginalName[
                                        splitedOriginalName.length - 1
                                      ] 
                       );

                    if( uploadProfileImage.error ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                if( req.files.coverImg ){

                    //insert outputpath
                    const { originalname } = req.files.coverImg[ 0 ];
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 )
                                         .toString( 'hex' );

                    const newFileName = userId + "_" 
                                               + randId 
                                               + "_coverImg";

                    req.profileImgNewFileName = newFileName;

                    const pathToSend = "profileAssets/" + userId
                                                        + "/"
                                                        + newFileName;

                    req.coverPath = pathToSend + "."
                                               + splitedOriginalName[
                                                    splitedOriginalName.length - 1
                                                 ];

                    try {

                        await fs.promises.writeFile(

                            newFileName + "." 
                                        + splitedOriginalName[
                                            splitedOriginalName.length - 1
                                          ],

                            req.files
                               .coverImg[ 0 ]
                               .buffer,

                            "binary"
                        );

                        console.log( "Dosya yazma başarılı" );

                    }catch( err ){
                        console.error( "Dosya yazma hatası:", err );
                    }

                    const writenFile = fs.createReadStream( 
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ] 
                                          );

                    const uploadProfileImage = await uploadFileHelper(
                                                        writenFile,
                                                        newFileName + "."
                                                                    + splitedOriginalName[
                                                                        splitedOriginalName.length - 1
                                                                      ],
                                                        'cover',
                                                        pathToSend,
                                                        res
                                                    );

                    fs.rmSync( 
                        newFileName + "."
                                    + splitedOriginalName[
                                        splitedOriginalName.length - 1
                                      ] 
                       );

                    if( uploadProfileImage.error ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                if(
                    req.files
                        .profileImg !== undefined
                    
                    && req.files
                            .profileImg[ 0 ]
                ){
                    req.user
                        .profileImg
                        .imgUrl = req.profilePath;

                    req.user
                        .profileImg
                        .recordedImgName = req.profilePath;

                    req.user
                        .profileImg
                        .isDefaultImg = false;

                    req.user
                        .markModified( 'profileImg' );
                }

                if(
                    req.files
                       .coverImg !== undefined

                    && req.files
                          .coverImg[ 0 ]
                ){
                    req.user
                       .coverImg
                       .imgUrl = req.coverPath;

                    req.user
                       .coverImg
                       .recordedImgName = req.coverPath;

                    req.user
                       .coverImg
                       .isDefaultImg = false;

                    req.user
                       .markModified( 'coverImg' );
                }

                next();
            }
        );
        

    }catch( err ){
        console.log( "ERROR: uploadProfileImageHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default uploadProfileAssetsHelper;
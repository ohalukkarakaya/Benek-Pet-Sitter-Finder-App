import Pet from "../../models/Pet.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadPetProfileImageHelper = async ( req, res, next ) => {
    try{
        upload.fields(
            [
                {
                    name: "petProfileImg",
                    maxCount: 1
                },
                {
                    name: "petCoverImg",
                    maxCount: 1
                }
            ]
        )(
            req,
            {},
            async ( err ) => {
                const petId = req.params.petId.toString();
                req.pet = await Pet.findById( petId );

                const pet = req.pet;

                const isDefaultProfileImg = pet.petProfileImg.isDefaultImg;
                const isDefaultCoverImg = pet.petCoverImg.isDefaultImg;

                //clean existing profile image from server
                if(
                    pet.petProfileImg.imgUrl !== null
                    && pet.petProfileImg.imgUrl !== ""
                    && !isDefaultProfileImg
                    && req.files !== undefined
                    && req.files
                          .petProfileImg !== undefined
                    && req.files
                          .petProfileImg[ 0 ]
                ){
                    const deleteExistingImage = await deleteFileHelper( pet.petProfileImg.imgUrl );
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
                    pet.petCoverImg.imgUrl !== null
                    && pet.petCoverImg.imgUrl !== ""
                    && !isDefaultCoverImg
                    && req.files !== undefined
                    && req.files
                          .petCoverImg !== undefined
                    && req.files
                          .petCoverImg[ 0 ]
                ){
                    const deleteExistingImage = await deleteFileHelper( pet.petCoverImg.imgUrl );
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

                if( req.files.petProfileImg ){

                    //insert outputpath
                    const { originalname } = req.files.petProfileImg[ 0 ];
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 )
                                         .toString( 'hex' );

                    const newFileName = petId + "_petProfileImg_"
                                              + randId;

                    req.profileImgNewFileName = newFileName;

                    const pathToSend =  "pets/" + petId
                                                + "/petProfileAssets/"
                                                + newFileName;

                    req.profilePath = pathToSend + "."
                                                 + splitedOriginalName[
                                                     splitedOriginalName.length - 1
                                                   ];

                    try {
                        await fs.promises.writeFile(
                            newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1],
                            req.files.petProfileImg[0].buffer,
                            "binary"
                        );
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

                if( req.files.petCoverImg ){

                    //insert outputpath
                    const { originalname } = req.files.petCoverImg[ 0 ];
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 )
                                         .toString( 'hex' );

                    const newFileName = petId + "_petCoverImg_"
                                              + randId;

                    req.profileImgNewFileName = newFileName;

                    const pathToSend =  "pets/" + petId
                                                + "/petProfileAssets/"
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
                               .petCoverImg[ 0 ]
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
                //images uploaded to server


                if(
                    req.files
                        .petProfileImg !== undefined
                    
                    && req.files
                            .petProfileImg[ 0 ]
                ){
                    req.pet
                       .petProfileImg
                       .imgUrl = req.profilePath;

                    req.pet
                        .petProfileImg
                        .recordedImgName = req.profilePath;

                    req.pet
                        .petProfileImg
                        .isDefaultImg = false;

                    req.pet
                        .markModified( 'petProfileImg' );
                }

                if(
                    req.files
                       .petCoverImg !== undefined

                    && req.files
                          .petCoverImg[ 0 ]
                ){
                    req.pet
                       .petCoverImg
                       .imgUrl = req.coverPath;

                    req.pet
                       .petCoverImg
                       .recordedImgName = req.coverPath;

                    req.pet
                       .petCoverImg
                       .isDefaultImg = false;

                    req.pet
                       .markModified( 'coverImg' );
                }

                next();
            }
        );
        

    }catch( err ){
        console.log( "ERROR: uploadPetProfileImageHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default uploadPetProfileImageHelper;
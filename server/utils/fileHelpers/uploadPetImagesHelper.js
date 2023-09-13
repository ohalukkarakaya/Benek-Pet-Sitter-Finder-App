import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

//upload images
const uploadPetImagesHelper = async ( req, res, next ) => {
    try{

        req.imageNames = [];
        const maxImageLimit = 6;
        const howmanyImageCanUploaded = maxImageLimit - req.pet
                                                           .images
                                                           .length;
        upload.array(
                'files',
                howmanyImageCanUploaded
        )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: petImage - ", err );
                    return res.status( 500 )
                              .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                              );
                }

                const pet = req.pet;

                for(
                    let file
                    of req.files
                ){
                    const { originalname } = file;

                    const petId = req.pet._id.toString();

                    const imageId = crypto.randomBytes( 6 )
                                          .toString( 'hex' );

                    const splitedOriginalName = originalname.split(".");

                    const newFileName = petId + "_petsImage_"
                                              + imageId
                                              + "."
                                              + splitedOriginalName[
                                                    splitedOriginalName.length - 1
                                                ];

                    const fileNameWithoutExtension = petId + "_petsImage_"
                                                           + imageId;

                    const pathToSend = "pets/" + petId
                                               + "/petsImages/"
                                               + fileNameWithoutExtension;

                    try {
                        await fs.promises.writeFile(
                            newFileName,
                            file.buffer,
                            "binary"
                        );
                    }catch( err ){
                        console.error("Dosya yazma hatası:", err);
                    }

                    const writenFile = fs.createReadStream( newFileName );

                    const uploadImage = await uploadFileHelper(
                        writenFile,
                        newFileName,
                        'photo',
                        pathToSend,
                        res
                    );

                    req.imageNames.push(
                                      pathToSend + "."
                                                 + splitedOriginalName[
                                                        splitedOriginalName.length - 1
                                                   ]
                                   );

                    fs.rmSync( newFileName );

                    if( uploadImage.error ){
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
        console.log( "ERROR: uploadPetImagesHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default uploadPetImagesHelper;
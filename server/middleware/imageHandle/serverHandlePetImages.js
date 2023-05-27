import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import Pet from "../../models/Pet.js";
import crypto from "crypto";
import s3 from "../../utils/s3Service.js";
dotenv.config();

//Storage
const storage = multerS3(
    {
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        contentType: ( 
            req, 
            file, 
            cb 
        ) => {
            try{
                const fileType = file.mimetype;
                cb(
                    null, 
                    fileType
                );
            }catch( err ){
                console.log( err );
            }
        },
        key: (
                req, 
                file, 
                cb
             ) => {
                try{

                    const { originalname } = file;
                    const petId = req.pet._id;

                    const imageId = crypto.randomBytes( 6 )
                                          .toString( 'hex' );

                    const splitedOriginalName = originalname.split(".");
                    
                    const newFileName = petId
                                        + "_petsImage_"
                                        + imageId
                                        + "."
                                        + splitedOriginalName[
                                                splitedOriginalName.length - 1
                                          ];

                    req.petProfileImgNewFileName = newFileName;
                    req.imageNames.push(
                                    "pets/" + petId.toString()
                                            + "/petsImages/"
                                            + newFileName
                                   );
                    
                    cb(
                        null, 
                        "pets/" + petId.toString()
                                + "/petsImages/"
                                + newFileName
                    );

                }catch( err ){
                    console.log( err );
                }
        }
    }
);

//File Filter
const fileFilter = (
    req, 
    file, 
    cb
) => {
    if(file){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
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

const uploadPetImages = async (req, res, next) => {
    try{
        req.imageNames = [];
        const maxImageLimit = 6;
        const howmanyImageCanUploaded = maxImageLimit - req.pet
                                                           .images
                                                           .length;
        if(
            howmanyImageCanUploaded > 0
        ){
            upload.array(
                'files',
                howmanyImageCanUploaded
            )(
                req,
                {},
                ( err ) => {
                    if( err ){
                        return res.status( 500 )
                                  .json(
                                        {
                                            error: true,
                                            errorData: err,
                                            message: "A problem occured wile uploading images"
                                        }
                                    );
                    }
                    next();
                }
            );
        }else{
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "there is 6 or more image uploaded allready"
                            }
                      );
        }
    }catch( err ){
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: err.message
                        }
                  )
    }
} 

export { uploadPetImages };
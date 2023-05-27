import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import Pet from "../../models/Pet.js";
import s3 from "../../utils/s3Service.js";
import crypto from "crypto";

dotenv.config();
const env = process.env;

//Storage
const storage = multerS3(
    {
        s3,
        bucket: env.BUCKET_NAME,
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

                const petId = req.pet
                                 ._id;

                const splitedOriginalName = originalname.split( "." );

                const randPass = crypto.randomBytes( 6 )
                                       .toString( 'hex' );

                if(
                    file.fieldname === "petProfileImg"
                ){
                    const newFileName = petId 
                                         + "_petProfileImg_"
                                         + randPass
                                         +"."
                                         + splitedOriginalName[
                                                splitedOriginalName.length - 1
                                           ];

                    req.petProfileImgNewFileName = newFileName;
                
                    cb(
                        null, 
                        "pets/" + petId
                                + "/petProfileAssets/"
                                + newFileName
                    );

                }else if(
                    file.fieldname === "petCoverImg"
                ){
                    const newFileName = petId
                                        + "_petCoverImg_"
                                        + randPass
                                        + "."
                                        + splitedOriginalName[
                                                    splitedOriginalName.length - 1
                                          ];

                    req.petCoverImgNewFileName = newFileName;
                
                    cb(
                        null, 
                        "pets/" + petId
                                + "/petProfileAssets/"
                                + newFileName
                    );
                }
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
    if( file ){
        if(
            file.mimetype === 'image/jpeg' 
            || file.mimetype === 'image/jpg'
        ){
            cb( 
                null, 
                true 
            );
        }else{
            cb( 
                new Error( "You can just upload '.jpg" ), 
                false 
            );
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

const deleteImg = async (
    deleteParams
) => {
    try {
        s3.deleteObject( 
            deleteParams,
            ( error, data ) => {
                if( error ){
                    console.log( "ERROR: deleteImg - ", error );
                }else{
                    return data
                }
            }
          )
    } catch ( err ) {
        console.log( "Error", err );
    }
  };

const ValidateAndCleanBucket = async (
    req,
    pet,
    isDefaultProfileImg,
    isDefaultCoverImg,
    recordedProfileImgName,
    recordedCoverImageName
) => {
    if(
        !isDefaultProfileImg
        && recordedProfileImgName
        && pet.petProfileImg !== undefined 

        && pet.petProfileImg
              .recordedImgName !== undefined
    ){
        const deleteProfileImageParams = {
            Bucket: env.BUCKET_NAME,
            Key: "pets/" + pet._id
                              .toString()
                         + "/petProfileAssets/"
                         + pet.petProfileImg
                              .recordedImgName
        };
        await deleteImg( deleteProfileImageParams );
    }

    if(
        !isDefaultCoverImg 
        && recordedCoverImageName
        && pet.petCoverImg !== undefined 
        && pet.petCoverImg
              .recordedImgName !== undefined
    ){
        const deleteCoverImageParams = {
            Bucket: env.BUCKET_NAME,
            Key: "pets/" + pet._id
                              .toString()
                         + "/petProfileAssets/"
                         + pet.petCoverImg
                              .recordedImgName
        };
        await deleteImg( deleteCoverImageParams );
    }
    return true;
}

const updatePetProfileImg = async (
    req, 
    res, 
    next
) => {
    try{
        const petId = req.params
                         .petId
                         .toString();

            await Pet.findOne(
                { _id: petId },
                ( err, pet ) => {
                    req.pet = pet;
                    const isDefaultProfileImg = pet.petProfileImg
                                                   .isDefaultImg;

                    const isDefaultCoverImg = pet.petCoverImg
                                                 .isDefaultImg;

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
                                ( err ) => {
                                    if(
                                        req.files !== undefined
                                        && req.files
                                              .petProfileImg 

                                        || req.files !== undefined
                                        && req.files
                                              .petCoverImg
                                    ){
                                        ValidateAndCleanBucket(
                                            req,
                                            pet,
                                            isDefaultProfileImg,
                                            isDefaultCoverImg,
                                            req.petProfileImgNewFileName,
                                            req.petCoverImgNewFileName
                                        ).then(
                                            (_) => {
                                                req.petProfilePath = env.CDN_SUBDOMAIN
                                                                      + "pets/"
                                                                      + petId
                                                                      + "/petProfileAssets/"
                                                                      + req.petProfileImgNewFileName;

                                                req.petCoverPath = env.CDN_SUBDOMAIN
                                                                    + "pets/"
                                                                    + petId
                                                                    + "/petProfileAssets/"
                                                                    + req.petCoverImgNewFileName;

                                                if(
                                                    req.files
                                                       .petProfileImg 

                                                    && req.files
                                                          .petCoverImg
                                                ){
                                                    //if there is profile image and cover image both
                                                    req.pet
                                                       .petProfileImg
                                                       .imgUrl = req.petProfilePath;

                                                    req.pet
                                                       .petProfileImg
                                                       .recordedImgName = req.petProfileImgNewFileName;

                                                    req.pet
                                                       .petProfileImg
                                                       .isDefaultImg = false;

                                                    req.pet
                                                       .petCoverImg
                                                       .imgUrl = req.petCoverPath;

                                                    req.pet
                                                       .petCoverImg
                                                       .recordedImgName = req.petCoverImgNewFileName;

                                                    req.pet
                                                       .petCoverImg
                                                       .isDefaultImg = false;

                                                }else if(
                                                    req.files
                                                       .petProfileImg

                                                    && !req.files
                                                           .petCoverImg
                                                ){
                                                    //if there is only profile image
                                                    req.pet
                                                       .petProfileImg
                                                       .imgUrl = req.petProfilePath;

                                                    req.pet
                                                       .petProfileImg
                                                       .recordedImgName = req.petProfileImgNewFileName;

                                                    req.pet
                                                       .petProfileImg
                                                       .isDefaultImg = false;

                                                }else if(
                                                    !req.files
                                                        .petProfileImg 
                                                    
                                                    && req.files
                                                          .petCoverImg
                                                ){
                    
                                                    //if there is only cover image
                                                    req.pet
                                                       .petCoverImg
                                                       .imgUrl= req.petCoverPath;

                                                    req.pet
                                                       .petCoverImg
                                                       .recordedImgName = req.petCoverImgNewFileName;

                                                    req.pet
                                                       .petCoverImg
                                                       .isDefaultImg = false;
                                                }
                                                next();
                                            }
                                        );
                                    }else{
                                        return res.status( 500 )
                                                  .json(
                                                        {
                                                            error: true,
                                                            message: "Internal Server Error"
                                                        }
                                                  );
                                    }
                                }
                            );
                }
            ).clone();
    }catch(err){
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: err.message
                    }
                  )
    }
} 

    export { updatePetProfileImg };
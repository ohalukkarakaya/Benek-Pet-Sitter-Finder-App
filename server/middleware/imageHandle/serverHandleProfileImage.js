import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import User from "../../models/User.js";

import crypto from "crypto";
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
            }catch( err ){
                console.log( err );
            }
        },
        key: (req, file, cb) => {

            const { originalname } = file;
            const userId = req.user
                              ._id;

            const splitedOriginalName = originalname.split(".");
            const randId = crypto.randomBytes( 6 )
                                 .toString( 'hex' );

            if( file.fieldname === "profileImg" ){
                const newFileName = `${ 
                                        userId 
                                    }_${ 
                                        randId 
                                      }_profileImg.${ 
                                                     splitedOriginalName[
                                                                splitedOriginalName.length - 1
                                                     ] 
                                                   }`;

                req.profileImgNewFileName = newFileName;
                req.profileCdnPath = `${
                                         process.env
                                                .CDN_SUBDOMAIN
                                      }profileAssets/${
                                                        userId
                                                     }/${
                                                            newFileName
                                                       }`;
                
                cb( null, "profileAssets/"+userId+"/"+newFileName );

            }else if( file.fieldname === "coverImg" ){
                const newFileName = `${
                                        userId 
                                    }_${
                                        randId 
                                      }_coverImg.${
                                                    splitedOriginalName[
                                                            splitedOriginalName.length - 1
                                                    ]
                                                 }`;
                                                 
                req.coverImgNewFileName = newFileName;
                req.coverCdnPath = `${
                                        process.env
                                               .CDN_SUBDOMAIN
                                    }profileAssets/${
                                                     userId
                                                   }/${
                                                        newFileName
                                                     }`;
                
                cb( null, "profileAssets/"+userId+"/"+newFileName );
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
        ){
            cb( null, true );
        }else{
            cb( 
                new Error(
                        "You can just upload '.jpg"
                    ), 
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
                if ( error ) {
                  console.log("Error", error);
                } else {
                  return data;
                }
              }
        );
    } catch( err ) {
        console.log( "Error", err );
    }
  };

const ValidateAndCleanBucket = async (
    req,
    user,
    isDefaultProfileImg,
    isDefaultCoverImg,
    recordedProileImgName,
    recordedCoverImgName
) => {
    if(
        !isDefaultProfileImg 
        && user.profileImg !== undefined
        && user.profileImg
               .recordedImgName !== undefined
        && req.files
              .profileImg !== undefined
    ){
        const deleteProfileImageParams = {
            Bucket: process.env
                           .BUCKET_NAME,
            Key: `profileAssets/${
                                   user._id
                                       .toString()
                                }/${
                                    recordedProileImgName
                                  }`
        };
        await deleteImg( deleteProfileImageParams );
    }
    if(
        !isDefaultCoverImg 
        && user.coverImg !== undefined 
        && user.coverImg
               .recordedImgName !== undefined
        && req.files
              .coverImg !== undefined
    ){
        const deleteCoverImageParams = {
            Bucket: process.env
                           .BUCKET_NAME,
            Key: `profileAssets/${
                                    user._id
                                        .toString()
                                }/${
                                    recordedCoverImgName
                                  }`
        };
        await deleteImg( deleteCoverImageParams );
    }
    return true;
}

const updateProfileImg = async (req, res, next) => {
    try{
        const userId = req.user._id;
            await User.findOne(
                { 
                    _id: userId,
                    "deactivation.isDeactive": false
                },
                (err, user) => {
                    req.user = user;
                    const isDefaultProfileImg = user.profileImg.isDefaultImg;
                    const isDefaultCoverImg = user.coverImg.isDefaultImg;
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
                        (err) => {
                            ValidateAndCleanBucket(
                                req,
                                user,
                                isDefaultProfileImg,
                                isDefaultCoverImg,
                                user.profileImg
                                    .recordedImgName,
                                user.coverImg
                                    .recordedImgName
                            ).then(
                                (_) => {
                                    if(
                                        req.files !== undefined

                                        && req.files
                                              .profileImg

                                        || req.files !== undefined 
                                           && req.files
                                                 .coverImg
                                    ){
                                        let updateParams;
                                        if(
                                            req.files
                                               .profileImg 

                                            && req.files
                                                  .coverImg
                                        ){
                                                //if there is profile image and cover image both
                                                req.user
                                                   .profileImg
                                                   .imgUrl = req.profileCdnPath;

                                                req.user
                                                   .profileImg
                                                   .recordedImgName = req.profileImgNewFileName;

                                                req.user
                                                   .profileImg
                                                   .isDefaultImg = false;

                                                req.user
                                                   .coverImg
                                                   .imgUrl = req.coverCdnPath;

                                                req.user
                                                   .coverImg
                                                   .recordedImgName = req.coverImgNewFileName;

                                                req.user
                                                   .coverImg
                                                   .isDefaultImg = false;

                                        }else if(
                                            req.files
                                               .profileImg 
                                               
                                            && !req.files
                                                   .coverImg
                                        ){
                                                //if there is only profile image
                                                req.user
                                                   .profileImg
                                                   .imgUrl = req.profileCdnPath;

                                                req.user
                                                   .profileImg
                                                   .recordedImgName = req.profileImgNewFileName;

                                                req.user
                                                   .profileImg
                                                   .isDefaultImg = false;

                                        }else if(
                                            !req.files
                                                .profileImg 

                                            && req.files
                                                  .coverImg
                                        ){
                                                //if there is only cover image
                                                req.user
                                                   .coverImg
                                                   .imgUrl= req.coverCdnPath;

                                                req.user
                                                   .coverImg
                                                   .recordedImgName = req.coverImgNewFileName;

                                                req.user
                                                   .coverImg
                                                   .isDefaultImg = false;
                                        }
                                        next();
                                    }else{
                                        next();
                                    }
                                }
                            );
                        }
                     );
                }
            ).clone();
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

    export { updateProfileImg };
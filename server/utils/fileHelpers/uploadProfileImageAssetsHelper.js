import User from "../../models/User.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadProfileImageAssetsHelper = async ( req, res, next ) => {
    try{
        upload.fields(
        [{
                name: "profileImg",
                maxCount: 1
            }]
        )(
            req,
            {},
            async ( err ) => {
                let isProfileImageExist = req.files !== undefined && req.files.profileImg !== undefined && req.files.profileImg[ 0 ];
                const userId = req.user._id.toString();
                req.user = await User.findById( userId );
                const user = req.user;
                const isDefaultProfileImg = user.profileImg.isDefaultImg;

                //clean existing profile image from server
                if(user.profileImg.imgUrl !== null && user.profileImg.imgUrl !== "" && !isDefaultProfileImg){
                    const deleteExistingImage = await deleteFileHelper( user.profileImg.imgUrl );
                    if( deleteExistingImage.error ){
                        return res.status( 500 ).json({
                            error: true,
                            message: "Internal Server Error"
                        });
                    }
                }

                if( isProfileImageExist ){
                    //insert outputpath
                    const { originalname } = req.files.profileImg[ 0 ];
                    const splitedOriginalName = originalname.split( "." );
                    const randId = crypto.randomBytes( 6 ).toString( 'hex' );

                    const newFileName = userId + "_" + randId + "_profileImg";
                    req.profileImgNewFileName = newFileName;

                    const pathToSend =  "profileAssets/" + userId + "/" + newFileName;
                    req.profilePath = pathToSend + "." + splitedOriginalName[splitedOriginalName.length - 1];

                    try {
                        await fs.promises.writeFile(
                            newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1],
                            req.files.profileImg[0].buffer,
                            "binary"
                        );
                    } catch (err) {
                        console.error("Dosya yazma hatası:", err);
                    }

                    const writenFile = fs.createReadStream(newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1]);
                    const uploadProfileImage = await uploadFileHelper(
                        writenFile,
                        newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1],
                        'profile',
                        pathToSend,
                        res
                    );

                    fs.rmSync(newFileName + "." + splitedOriginalName[splitedOriginalName.length - 1]);

                    if( uploadProfileImage.error ){
                        return res.status( 500 ).json({
                            error: true,
                            message: "Internal Server Error"
                        });
                    }
                }

                if(isProfileImageExist){
                    req.user.profileImg.imgUrl = req.profilePath;
                    req.user.profileImg.recordedImgName = req.profilePath;
                    req.user.profileImg.isDefaultImg = false;
                } else {
                    req.user.profileImg.imgUrl = req.user.defaultImage;
                    req.user.profileImg.recordedImgName = req.user.defaultImage;;
                    req.user.profileImg.isDefaultImg = true;
                }

                req.user.markModified( 'profileImg' );

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

export default uploadProfileImageAssetsHelper;
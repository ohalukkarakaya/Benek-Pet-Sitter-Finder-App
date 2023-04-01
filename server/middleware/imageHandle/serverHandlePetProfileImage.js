import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import Pet from "../../models/Pet.js";
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
            }catch(err){
                console.log(err);
            }
        },
        key: (req, file, cb) => {
            try{
                const { originalname } = file;
                const petId = req.pet._id;

                const splitedOriginalName = originalname.split(".");

                if(file.fieldname === "petProfileImg"){
                    const newFileName = `${petId}_petProfileImg.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                    req.petProfileImgNewFileName = newFileName;
                
                    cb(null, "pets/"+petId+"/petProfileAssets/"+newFileName);

                }else if(file.fieldname === "petCoverImg"){
                    const newFileName = `${petId}_petCoverImg.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                    req.petCoverImgNewFileName = newFileName;
                
                    cb(null, "pets/"+petId+"/petProfileAssets/"+newFileName);
                }
            }catch(err){
                console.log(err);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'image/jpeg'){
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

const deleteImg = async (req, file, deleteParams) => {
    try {
        fileFilter.then(
            (_) => {
                s3.deleteObject(deleteParams).promise();
                console.log("Success", data);
                return data;
            }
        );
    } catch (err) {
        console.log("Error", err);
    }
  };

const ValidateAndCleanBucket = async (
    req,
    pet,
    isDefaultProfileImg,
    isDefaultCoverImg,
    recordedImgName
) => {
    if(!isDefaultProfileImg && pet.petProfileImg !== undefined && pet.petProfileImg.recordedImgName !== undefined){
        const deleteProfileImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `petProfileAssets/${pet._id}/${recordedImgName}`
        };
        await deleteImg(deleteProfileImageParams);
    }
    if(!isDefaultCoverImg && pet.petCoverImg !== undefined && pet.petCoverImg.recordedImgName !== undefined){
        const deleteCoverImageParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `Pets/${pet._id}/${recordedImgName}`
        };
        await deleteImg(deleteCoverImageParams);
    }
}

const updatePetProfileImg = async (req, res, next) => {
    try{
        const petId = req.params.petId;
            await Pet.findOne(
                { _id: petId},
                (err, pet) => {
                    req.pet = pet;
                    const isDefaultProfileImg = pet.petProfileImg.isDefaultImg;
                    const isDefaultCoverImg = pet.petCoverImg.isDefaultImg;
                    ValidateAndCleanBucket(
                        req,
                        isDefaultProfileImg,
                        isDefaultCoverImg,
                        pet.petProfileImg.recordedImgName,
                        pet.petCoverImg.recordedImgName
                    ).then(
                        (_) => {
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
                                (err) => {
                                    if(req.files !== undefined && req.files.petProfileImg || req.files !== undefined && req.files.petCoverImg){
                                        let updateParams;
                                        req.petProfilePath = `${process.env.CDN_SUBDOMAIN}pets/${petId}/petProfileAssets/${req.petProfileImgNewFileName}`;
                                        req.petCoverPath = `${process.env.CDN_SUBDOMAIN}pets/${petId}/petProfileAssets/${req.petCoverImgNewFileName}`;
                                        if(req.files.petProfileImg && req.files.petCoverImg){
                                                //if there is profile image and cover image both
                                                req.pet.petProfileImg.imgUrl = req.petProfilePath;
                                                req.pet.petProfileImg.recordedImgName = req.petProfileImgNewFileName;
                                                req.pet.petProfileImg.isDefaultImg = false;
                                                req.pet.petCoverImg.imgUrl = req.petCoverPath;
                                                req.pet.petCoverImg.recordedImgName = req.petCoverImgNewFileName;
                                                req.pet.petCoverImg.isDefaultImg = false;

                                        }else if(req.files.petProfileImg && !req.files.petCoverImg){
                                                //if there is only profile image
                                                req.pet.petProfileImg.imgUrl = req.petProfilePath;
                                                req.pet.petProfileImg.recordedImgName = req.petProfileImgNewFileName;
                                                req.pet.petProfileImg.isDefaultImg = false;

                                        }else if(!req.files.petProfileImg && req.files.petCcoverImg){
                                                //if there is only cover image
                                                req.pet.petCoverImg.imgUrl= req.petCoverPath;
                                                req.pet.petCoverImg.recordedImgName = req.petCoverImgNewFileName;
                                                req.pet.petCoverImg.isDefaultImg = false;
                                        }
                                        next();
                                    }else{
                                        return res.status(500).json(
                                            {
                                                error: true,
                                                message: "Internal Server Error"
                                            }
                                        );
                                    }
                                });
                            }
                        )
                    }
                ).clone();
    }catch(err){
        return res.status(500).json(
            {
                error: true,
                message: err.message
            }
        )
    }
} 

    export { updatePetProfileImg };
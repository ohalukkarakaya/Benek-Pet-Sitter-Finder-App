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
        key: (req, file, cb) => {
            try{

                const { originalname } = file;
                const petId = req.pet._id;

                const imageId = `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`
                const splitedOriginalName = originalname.split(".");
                const newFileName = `${petId}_petsImage${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.petProfileImgNewFileName = newFileName;
                
                cb(null, "pets/"+petId.toString()+"/petsImages/"+newFileName);

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

const uploadPetImages = async (req, res, next) => {
    try{
        const petId = req.params.petId;
            await Pet.findOne(
                { _id: petId},
                (err, pet) => {
                    req.pet = pet;
                    const howmanyImageCanRecorded = 6 - pet.images.length;
                    if(howmanyImageCanRecorded > 0){
                        upload.array(
                            'files',
                            howmanyImageCanRecorded
                        )(
                            req,
                            {},
                            (err) => {
                                if(err){
                                    return res.status(500).json(
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
                        return res.status(406).json(
                            {
                                error: true,
                                message: "there is 6 or more image uploaded allready"
                            }
                        );
                    }
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

    export { uploadPetImages };
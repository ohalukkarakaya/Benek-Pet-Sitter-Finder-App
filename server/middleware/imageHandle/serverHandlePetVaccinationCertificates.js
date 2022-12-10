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

                const imageId = `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
                const splitedOriginalName = originalname.split(".");
                const newFileName = `${petId}_vaccinationCertificate${imageId}.${splitedOriginalName[splitedOriginalName.length - 1]}`;
                req.petProfileImgNewFileName = newFileName;
                
                cb(null, "pets/"+petId.toString()+"/petsVaccinationCertificates/"+newFileName);

            }catch(err){
                console.log(err);
            }
        }
    }
);

//File Filter
const fileFilter = (req, file, cb) => {
    if(file){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
            cb( null, true );
        }else{
            cb( new Error('You can just upload ".jpg" or ".pdf"'), false );
        }
    }else{
        cb( new Error('Certificate and description is required'), false );
    }
};

//Upload Function
const upload = multer(
    {
        storage: storage,
        fileFilter,
        limits: { fileSize: 1000000 }

    }
);

//Upload File
const uploadPetVaccinationCertificate = async (req, res, next) => {
    try{
        upload.single( 'file' )(
            req,
            {},
            (error) => {
                if(error){
                    console.log("error", error);
                    return res.status(500).json(
                        {
                            error: true,
                            errorData: error,
                            message: "A problem occured wile uploading certificate"
                        }
                    );
                }
                next();
            }
        );
    }catch(err){
        return res.status(500).json(
            {
                error: true,
                message: err.message
            }
        )
    }
} 

    export { uploadPetVaccinationCertificate };
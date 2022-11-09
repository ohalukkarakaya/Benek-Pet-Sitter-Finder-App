import multer from "multer";

//Rename profile image
const storage = multer.diskStorage({
    destination: (req, fiprofileImgle, cb) => {
        cb(null, "s3UploadBridge");
    },
    filename: (req, profileImg, cb) => {
        const { originalname } = profileImg;
        const userId = req.user._id;
        const newFileName = `profile-${userId}.${originalname.split(".")[1]}`;
        req.newFileName = newFileName;
        cb(null, newFileName);
    }
});

//File Filter
const fileFilter = (req, profileImg, cb) => {
    if(profileImg.mimetype === 'image/jpeg'){
        cb( null, true );
    }else{
        cb( new Error("You can just upload '.jpg"), false );
    }
};

const upload = multer(
    {
      storage,
      fileFilter,
      limits: { fileSize: 1000000 }
    }
);

export default upload;
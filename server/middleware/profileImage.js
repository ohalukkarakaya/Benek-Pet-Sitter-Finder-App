import multer from "multer";

//Rename profile image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        const userId = req.user._id;
        cb(null, `profile-${userId}.${originalname.split(".")[1]}`);
    }
});

//File Filter
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg'){
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
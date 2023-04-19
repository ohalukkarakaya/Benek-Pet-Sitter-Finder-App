import s3 from "../../../utils/s3Service.js";

import dotenv from "dotenv";

dotenv.config();

const deletePetsImagesController = async (req, res) => {
    try{
        const urlList = req.body.urlList;
        if(!urlList || !(urlList.length > 0)){
          return res.status(400).json(
            {
              error: true,
              message: "Image url to delete is required"
            }
          );
        }
  
        const promiseUrlDelete = urlList.map(
          (url) => {
            return new Promise(
              (resolve, reject) => {
                const splitUrl = url.split('/');
                const imgName = splitUrl[splitUrl.length - 1];
    
                const deleteImageParams = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: `pets/${req.pet._id.toString()}/petsImages/${imgName}`
                };
                s3.deleteObject(
                  deleteImageParams,
                  (error, data) => {
                    if(error){
                      console.log("error", error);
                      return res.status(500).json(
                        {
                          error: true,
                          message: "An error occured while deleting images"
                        }
                      );
                    }
  
                    req.pet.images = req.pet.images.filter(
                      img => 
                        img.imgUrl !== url
                    );
                    return resolve(true);
                  }
                );
              }
            );
          }
        );
  
        Promise.all(promiseUrlDelete).then(
          (_) => {
            const petImages = req.pet.images;
            req.pet.markModified("images");
            req.pet.save(
              (err) => {
                if(err){
                  console.log("error", err);
                  return res.status(500).json(
                    {
                      error: true,
                      message: "An error occured while saving to database"
                    }
                  );
                }
              }
            );
            return res.status(200).json(
              {
                error: false,
                message: "images deleted succesfully",
                remainedPetImages: petImages
              }
            );
          }
        );
    }catch(err){
        console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default deletePetsImagesController;
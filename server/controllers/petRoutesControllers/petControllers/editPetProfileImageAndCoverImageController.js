import dotenv from "dotenv";

dotenv.config();

const editPetProfileImageAndCoverImageController = async (req, res,) => {
    try{
        let petProfileImageSucces;
        let petCoverImageSucces;
        let successResponse;
  
        //if there is existing images and they uploaded to media server
        if (req.files) {
  
          if(req.files.petProfileImg){
            var uploadedProfileImgImage = req.petProfilePath;
          }
          if(req.files.petCoverImg){
            var uploadedCoverImgImage = req.petCoverPath;
          }
  
          if(
            req.files.petProfileImg
            && req.files.petCoverImg
          ) {
            //if there is profile image and cover image both
            petProfileImageSucces = uploadedProfileImgImage;
            petCoverImageSucces = uploadedCoverImgImage;
          }else if(
            req.files.petProfileImg
            && !req.files.petCoverImg
          ) {
            //if there is only profile image
            petProfileImageSucces = uploadedProfileImgImage;
          }else if(
            !req.files.petProfileImg
            && req.files.petCoverImg
          ) {
            //if there is only cover image
            petCoverImageSucces = uploadedCoverImgImage;
          }
        }
  
        //check what did updated
        if(
          petProfileImageSucces !== null
          || petCoverImageSucces !== null
        ){
          successResponse = {
            error: false,
            profileImageUrl: petProfileImageSucces,
            coverImageUrl: petCoverImageSucces
          };
        }
  
        if(successResponse !== null){
          await req.pet.save(
            function (err) {
              if(err) {
                  console.error('ERROR: While Update!');
              }
            }
          );
          return res.status(200).json(
            successResponse
          );
        }else{
          return res.status(400).json(
            {
              error: true,
              message: "Empty Request Body"
            }
          );
        }
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

export default editPetProfileImageAndCoverImageController;
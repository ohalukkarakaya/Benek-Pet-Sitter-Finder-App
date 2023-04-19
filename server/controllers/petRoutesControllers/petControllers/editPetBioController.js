import dotenv from "dotenv";

dotenv.config();

const editPetBioController = async (req, res) => {
    try{
        if(!req.body.newBio && typeof req.body.newBio !== "string"){
          return res.status(400).json(
            {
              error: true,
              message: 'Property "newBio" with "String" value is required'
            }
          );
        }
  
        const newBio = req.body.newBio;
  
        req.pet.bio = newBio;
  
        req.pet.markModified('bio');
        const petBio = req.pet.bio;
        req.pet.save(
          function (err) {
            if(err) {
              console.error('ERROR: While Update!');
            }
          }
        );
  
        return res.status(200).json(
          {
            error: false,
            newPetBio: petBio
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

export default editPetBioController;
import { animalCategoryReqValidation } from "../../../utils/bodyValidation/animalCategoryReqValidationSchema.js";
import User from "../../../models/User.js";

const insertKeyWordsController = async (req, res) => {
    try{
        const { error } = animalCategoryReqValidation(req.body);
        if(error){
            return res.status(400).json(
                {
                  error: true,
                  message: error.details[0].message
                }
              );
        }else{
            User.findById(
                req.user._id,
                (error, updateUser) => {
                    if(error){
                        return res.status(404).json(
                            {
                                error: true,
                                message: "User can not found"
                            }
                        );
                    }else{
                        if(updateUser.deactivation.isDeactive){
                            return res.status(404).json(
                                {
                                    error: true,
                                    message: "User not found"
                                }
                            );
                        }
                        const requestArray = req.body.selectedPetCategories;
                        const isArrayEmpty = requestArray.length === 0;
                        if( !isArrayEmpty ){
                            for(var i = 0; i < requestArray.length; i ++){
                                const petTag = {
                                    petId: requestArray[i].petId,
                                    speciesId: requestArray[i].speciesId
                                };
                                const isTagAllreadyExist = updateUser.interestingPetTags.find(
                                    tag => 
                                        tag.petId === petTag.petId
                                        && tag.speciesId === petTag.speciesId
                                );
                                if(isTagAllreadyExist){
                                    updateUser.interestingPetTags = updateUser.interestingPetTags.filter(
                                        tag => 
                                            tag.petId !== petTag.petId
                                            && tag.speciesId !== petTag.speciesId 
                                    );
                                }else{
                                    updateUser.interestingPetTags.push(petTag);
                                }
                            };
                            updateUser.markModified('interestingPetTags');
                            updateUser.save(
                                function (err) {
                                    if(err) {
                                        console.error('ERROR: While Update!');
                                        return res.status(500).json(
                                            {
                                                error: true,
                                                message: "Internal server error"
                                            }
                                        );
                                    }
                                }
                            ).then(
                                (data) => {
                                    return res.status(200).json({
                                        error: false,
                                        message: "Tag process succesful"
                                    });
                                }
                            )
                        }
                    }
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

export default insertKeyWordsController;
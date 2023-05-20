import { animalCategoryReqValidation } from "../../../utils/bodyValidation/animalCategoryReqValidationSchema.js";
import User from "../../../models/User.js";

const insertKeyWordsController = async (req, res) => {
    try{
        const { error } = animalCategoryReqValidation(req.body);
        if( error ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: error.details[ 0 ]
                                              .message
                            }
                       );
        }
        User.findById(
            req.user._id,
            (error, updateUser) => {
                if( 
                    error
                    || updateUser.deactivation
                                 .isDeactive
                ){
                    return res.status( 404 )
                              .json(
                                  {
                                    error: true,
                                    message: "User can not found"
                                  }
                              );
                }

                const requestArray = req.body
                                        .selectedPetCategories;

                if( 
                    !requestArray
                    || requestArray.length <= 0
                ){
                    return res.status( 400 )
                              .json(
                                {
                                    error: true,
                                    message: "Missing Param"
                                }
                              );
                }

                requestArray.forEach(
                    ( selectedPetCategory ) => {
                        const petTag = {
                            petId: selectedPetCategory.petId,
                            speciesId: selectedPetCategory.speciesId
                        };
                        const isTagAllreadyExist = updateUser.interestingPetTags
                                                             .find(
                                                                tag => 
                                                                    tag.petId === petTag.petId
                                                                    && tag.speciesId === petTag.speciesId
                                                              );
                        if( isTagAllreadyExist ){
                            updateUser.interestingPetTags = updateUser.interestingPetTags
                                                                      .filter(
                                                                        tag => 
                                                                            tag.petId !== petTag.petId
                                                                            && tag.speciesId !== petTag.speciesId 
                                                                       );
                        }else{
                            updateUser.interestingPetTags
                                      .push( petTag );
                        }
                    }
                );
                updateUser.markModified( 'interestingPetTags' );
                updateUser.save(
                    ( err ) => {
                        if( err ) {
                            console.error('ERROR: While Update!');
                            return res.status( 500 )
                                      .json(
                                            {
                                                error: true,
                                                message: "Internal server error"
                                            }
                                       );
                        }
                    }
                ).then(
                    ( data ) => {
                        return res.status( 200 )
                                  .json(
                                        {
                                            error: false,
                                            message: "Tag process succesful"
                                        }
                                   );
                    }
                )    
            }
        );    
    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default insertKeyWordsController;
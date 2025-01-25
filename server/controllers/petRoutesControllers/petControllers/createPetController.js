import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import generateRandomAvatarHelper from "../../../utils/defaultAvatarHelpers/generateRandomAvatarHelper.js";
import { createPetReqBodyValidation } from "../../../utils/bodyValidation/pets/createPetValidationSchema.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const rawPetDataset = require( '../../../src/pet_dataset.json' );
const petDataset = JSON.parse( JSON.stringify( rawPetDataset ) );

import dotenv from "dotenv";

dotenv.config();

const createPetController = async (req, res) => {
    try{
        const { error } = createPetReqBodyValidation( req.body );
        if( error )
          return res.status( 400 )
                    .json(
                      {
                        error: true,
                        message: error.details[0]
                                      .message
                      }
                    );
          
        let petKind;
        let petSpecies;
  
        for( var i = 0; i < petDataset.pets.length; i ++ ){
          if( petDataset.pets[i].id === req.body.kindCode  ){
            petKind = petDataset.pets[i].name;
            for(
              var index = 0; 
              index < petDataset.pets[i].species.length;
              index ++
            ){
              if( petDataset.pets[i].species[index].id === req.body.speciesCode ){
                petSpecies = {
                  "tr": petDataset.pets[i].species[index].tr,
                  "en": petDataset.pets[i].species[index].en
                };
              }
            }
          }
        }
    
        const pet = await Pet.find(
          {
            $or: [
              {
                name: req.body.name,
                kind: req.body.kindCode,
                species: req.body.speciesCode,
                primaryOwner: req.user._id
              },
              {
                name: req.body.name,
                kind: req.body.kindCode,
                species: req.body.speciesCode,
                allOwners: { $in: [ req.user._id ]}
              }
            ]
          }
        );
        if(pet.length > 0){
          return res.status(400).json(
            {
              error: true,
              message: "Pet Allready Exists",
              petId: pet._id,
              petName: pet.name 
            }
          );
        }

        // default profile image oluştur
        const assetIdiesJson = generateRandomAvatarHelper( true );
        const avatarAssetId = assetIdiesJson.avatarId;
        const backGroundAssetId = assetIdiesJson.backGroundId;

        const defaultAvatar = `P/${backGroundAssetId}/${avatarAssetId}`;
    
        await new Pet(
          {
            name: req.body.name,
            defaultImage: defaultAvatar,
            bio: req.body.petBio,
            sex: req.body.sex,
            birthDay: req.body.birthDay,
            kind: req.body.kindCode,
            species: req.body.speciesCode,
            primaryOwner: req.user._id,
            allOwners: [ req.user._id ],
          }
        ).save()
         .then(
          async ( result ) => {
            const user = await User.findById( 
                                          req.user
                                             ._id
                                             .toString() 
                                    );
            if(
              !user 
              || user.deactivation
                     .isDeactive
            ){
              return res.status( 404 )
                        .json(
                          {
                            error: true,
                            message: "User Not Found"
                          }
                        );
            }
            user.pets
                .push(
                    result._id
                          .toString()
                 );
            user.markModified( "pets" );
            user.save()
                .then(
                  (_) => {
                    const currentYear = new Date().getFullYear();
                    const petsBirthYear = result.birthDay
                                                .getFullYear();
      
                    return res.status( 200 )
                              .json(
                                {
                                  error: false,
                                  message: "Pet created succesfully",
                                  data: {
                                    petId: result._id,
                                    petName: pet.name,
                                    petAge: `${currentYear - petsBirthYear} years old`,
                                    petKind: petKind,
                                    petSpecies: petSpecies
                                  }
                                }
                              );
                  }
                );
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

export default createPetController;
import express from "express";
import AnimalCategories from "../../models/AnimalCategories.js";
import { animalCategoryReqValidation } from "../../utils/animalCategoryReqValidationSchema.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

//Insert Animal Category
router.post(
    "/insertAnimalCategory",
    auth,
    async (req, res) => {
      try{
        const { error } = animalCategoryReqValidation(req.body);
        if(error)
          return res.status(400).json(
            {
              error: true,
              message: error.details[0].message
            }
          );
  
        const animal = await AnimalCategories.findOne(
            {
                category: req.body.category
            }
        );
        if(animal){
            if(
                animal.animalName.some(
                    item => item.tr === req.body.animalName.tr
                        && item.en === req.body.animalName.en
                )
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Animal Allready Exists"
                    }
                );
            }else{
                //push animal name to category
                animal.animalName.push(req.body.animalName);
                animal.markModified('animalName');
                animal.save().then(
                    (result) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: `animal inserted to category ${animal.category.en}`
                            }
                        );
                    }
                )
            }
        }else{
            console.log(req.body);
            //create a category and insert animal name
            await new AnimalCategories(
                {
                  category: req.body.category,
                  animalName: [ req.body.animalName ],
                }
            ).save().then(
              (result) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "Animal inserted",
                        insertedData: result
                    }
                );
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
  );

  export default router;
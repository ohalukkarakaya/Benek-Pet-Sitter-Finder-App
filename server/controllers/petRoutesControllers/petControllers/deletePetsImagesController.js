import s3 from "../../../utils/s3Service.js";

import dotenv from "dotenv";
import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";

dotenv.config();

const deletePetsImagesController = async (req, res) => {
    try{
        const urlList = req.body.urlList;
        if(
          !urlList 
          || !( urlList.length > 0 )
        ){
          return res.status( 400 )
                    .json(
                        {
                          error: true,
                          message: "Image url to delete is required"
                        }
                     );
        }

        for(
          let url
          of urlList
        ){
          const deleteImg = await deleteFileHelper( url );
          if( deleteImg.err ){
            console.log( `ERROR: Image On Url '${url}' Couldn't Deleted` );
            break;
          }

          req.pet.images = req.pet.images.filter(
            img => 
              img.imgUrl !== url
          );
        }

        const petImages = req.pet.images;
        req.pet.markModified( "images" );
        req.pet.save(
          ( err ) => {
            if( err ){
              console.log( "error", err );
              return res.status( 500 )
                        .json(
                            {
                              error: true,
                              message: "An error occured while saving to database"
                            }
                          );
            }
          }
        );
        return res.status( 200 )
                  .json(
                      {
                        error: false,
                        message: "images deleted succesfully",
                        remainedPetImages: petImages
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

export default deletePetsImagesController;
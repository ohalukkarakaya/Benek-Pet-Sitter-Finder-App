import dotenv from "dotenv";

dotenv.config();

const insertPetVaccinationCertificateController = async (req, res) => {
    try{
        if( req.certificatePath ){
          if( !req.pet.vaccinations ){
            req.pet.vaccinations = [];
          }
          req.pet
             .vaccinations
             .push(
                {
                  desc: req.body.desc,
                  fileUrl: req.certificatePath
                }
              );

          req.pet
             .markModified( 'vaccinations' );

          req.pet
             .save(
                function ( err ){
                  if( err ){
                      console.error( 'ERROR: While Update!' );
                  }
                }
              );
          return res.status( 200 )
                    .json(
                        {
                          error: false,
                          url: req.certificatePath,
                          desc: req.body.desc
                        }
                     );
        }
      }catch( err ){
          console.log( "ERROR: insertPetVaccinationCertificateController - ", err );
          res.status( 500 )
             .json(
                  {
                      error: true,
                      message: "Internal Server Error"
                  }
              );
      }
}

export default insertPetVaccinationCertificateController;
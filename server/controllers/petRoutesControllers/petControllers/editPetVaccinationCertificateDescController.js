import { editVaccinationCertificateValidation } from "../../../utils/bodyValidation/pets/editVaccinationCertificateReqValidationSchema.js";

import dotenv from "dotenv";

dotenv.config();

const editPetVaccinationCertificateDescController = async (req, res) => {
    try{
        const { error } = editVaccinationCertificateValidation( req.body );
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
            
  
        const certificateUrl = req.body
                                  .certificateUrl;

        const newDesc = req.body
                           .newDesc;

        const vaccinations = req.pet
                                .vaccinations;

        const certificate = vaccinations.find(
                                            vaccinationObject =>
                                                vaccinationObject.fileUrl === certificateUrl
                                         );

        if( !certificate ){
          return res.status( 404 )
                    .json(
                      {
                        error: true,
                        message: "Certificate Not Found"
                      }
                    );
        }

        certificate.desc = newDesc;
  
        req.pet
           .markModified( 'vaccinations' );

        req.pet
           .save(
              ( err ) => {
                if( err ){
                    console.error('ERROR: While Update!');
                }
              }
           );
  
        return res.status( 200 )
                  .json(
                    {
                      error: false,
                      petsVaccinations: vaccinations
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

export default editPetVaccinationCertificateDescController;
import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";

const deletePetVaccinationCertificateController = async (req, res) => {
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
                          message: "File url to delete is required"
                        }
                     );
        }

        for(
          let url
          of urlList
        ){
          const deleteCertificate = await deleteFileHelper( url );
          if( deleteCertificate.error ){
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal Server Error"
                        }
                      );
          }

          req.pet
             .vaccinations = req.pet
                                .vaccinations
                                .filter(
                                    vaccination => 
                                        vaccination.fileUrl !== url
                                 );
        }

        const petVaccinations = req.pet.vaccinations;
        req.pet.markModified("vaccinations");
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
                        message: "vaccination deleted succesfully",
                        remainedVaccinations: petVaccinations
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

export default deletePetVaccinationCertificateController;
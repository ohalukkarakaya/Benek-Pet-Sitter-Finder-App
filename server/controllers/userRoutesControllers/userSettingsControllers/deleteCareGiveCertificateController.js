import User from "../../../models/User.js";

import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";

const deleteCareGiveCertificateController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const urlList = req.body.urlList;
        if(
            !urlList 
            || !( urlList.length > 0 )
        ){
          return res.status( 400 ).json(
            {
              error: true,
              message: "File url to delete is required"
            }
          );
        }

        const user = await User.findById( userId );
  
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

          user.identity
              .certificates = user.identity
                                  .certificates
                                  .filter(
                                    certificate => 
                                      certificate.fileUrl !== url
                                   );
        }

        const certificates = user.identity
                                 .certificates;

        user.markModified( "identity" );
        user.save(
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
                        message: "certificates deleted succesfully",
                        remainedCertificates: certificates
                      }
                   );

    }catch( err ){
        console.log( "ERROR: deleteCareGiveCertificateController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default deleteCareGiveCertificateController;
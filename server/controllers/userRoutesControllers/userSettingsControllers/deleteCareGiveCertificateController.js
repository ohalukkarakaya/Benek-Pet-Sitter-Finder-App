import User from "../../../models/User.js";
import s3 from "../../../utils/s3Service.js";

import dotenv from "dotenv";

dotenv.config();
const env = process.env;
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
  
        const promiseUrlDelete = urlList.map(
          ( url ) => {
            return new Promise(
              (
                resolve, 
                reject
              ) => {
                const splitUrl = url.split('/');
                const imgName = splitUrl[ 
                                      splitUrl.length - 1 
                                ];
    
                const deleteImageParams = {
                  Bucket: env.BUCKET_NAME,
                  Key: `profileAssets/${ 
                                          userId 
                                      }/careGiveCertificates/${
                                                                imgName
                                                            }`
                };
                s3.deleteObject(
                  deleteImageParams,
                  ( error, data ) => {
                    if( error ){
                      console.log("error", error);
                      return res.status( 500 )
                                .json(
                                  {
                                    error: true,
                                    message: "An error occured while deleting certificate"
                                  }
                                );
                    }
  
                    user.identity
                        .certificates = user.identity
                                            .certificates
                                            .filter(
                                                vaccination => 
                                                    vaccination.fileUrl !== url
                                             );
                    return resolve( true );
                  }
                );
              }
            );
          }
        );
  
        Promise.all( promiseUrlDelete )
               .then(
                  (_) => {
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
                                  message: "certificate deleted succesfully",
                                  remainedVaccinations: certificates
                                }
                              );
                  }
                );
    }catch( err ){
        console.log("ERROR: deleteCareGiveCertificateController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default deleteCareGiveCertificateController;
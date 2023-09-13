const insertCareGiverCertificateController = async ( req, res ) => {
    try{
        const user = req.user;

        if( req.certificatePath ){
            if(
                !(
                    user.identity
                        .certificates
                )
            ){
                user.identity
                    .certificates = [];
            }
            

            user.identity
                .certificates.push(
                    {
                        desc: req.body.desc,
                        fileUrl: req.certificatePath
                    }
                );
            user.markModified('identity');
            user.save(
              ( err ) => {
                if( err ) {
                    console.error('ERROR: While Update!');
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                              );
                }
              }
            );
            return res.status( 200 )
                      .json(
                        {
                            error: false,
                            message: "Certificate Inserted Succesfully",
                            url: req.certificatePath,
                            desc: req.body.desc
                        }
                      );
        }else{
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Cretificate Couldn't Uploaded"
                        }
                      );
        }
    }catch( err ){
        console.log( "ERROR: insertCareGiverCertificateController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default insertCareGiverCertificateController;
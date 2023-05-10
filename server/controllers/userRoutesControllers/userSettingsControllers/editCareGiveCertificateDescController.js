import User from "../../../models/User.js";

const editCareGiveCertificateDescController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const certificateUrl = req.body.certificateUrl;
        const newDesc = req.body.desc;
        if( 
            !certificateUrl 
            || !newDesc
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const user = await User.findById( userId );
        const certificate = user.identity
                                .certificates
                                .filter(
                                    certificateObject =>
                                        certificateObject.fileUrl === certificateUrl
                                );

        if( !certificate ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Certificate Not Found"
                }
            );
        }

        certificate.desc = newDesc;
        user.markModified( "identity");
        user.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }
              }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "New Desc Inserted Succesfully",
                newDesc: newDesc
            }
        );
        
    }catch( err ){
        console.log("ERROR: editCareGiveCertificateDescController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default editCareGiveCertificateDescController;
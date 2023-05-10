import User from "../../../models/User.js";

const insertCareGiverCertificateController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const user = await User.findById( userId );
        if(req.cdnUrl){
            user.identity.certificates.push(
                {
                    desc: req.body.desc,
                    fileUrl: req.cdnUrl
                }
            );
            user.markModified('identity');
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
            return req.res.status( 200 ).json(
              {
                error: false,
                message: "Certificate Inserted Succesfully",
                url: req.cdnUrl,
                desc: req.body.desc
              }
            );
          }
    }catch( err ){
        console.log("ERROR: insertCareGiverCertificateController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default insertCareGiverCertificateController;
import User from "../../../models/User.js";
import crypto from "crypto";


const getPrivateUserInfoController = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const user = await User.findById( userId ).lean();
        if( !user ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

        let name = `${ user.identity && user.identity.firstName ? user.identity.firstName : '' } ${ user.identity && user.identity.middleName ? user.identity.middleName : '' } ${ user.identity && user.identity.lastName ? user.identity.lastName : '' }`.replaceAll( 'undefined', '' ).replaceAll( "  ", " ");
        let userName = user.userName;

        let email = user.email;
        let phone = user.phone;

        let iban = user.iban;

        //decrypt careGiver National IdNo
        const recordedIv = user.identity.nationalId.iv;
        const cryptedNationalId = user.identity.nationalId.idNumber;

        const iv = Buffer.from( recordedIv, 'hex' );
        const decipher = crypto.createDecipheriv(
            process.env.NATIONAL_ID_CRYPTO_ALGORITHM,
            Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ),
            iv
        );

        let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8' );
        nationalIdNo += decipher.final( 'utf8' );

        return res.status( 200 ).json({
            error: false,
            data: {
                name,
                userName,
                email,
                phone,
                iban,
                nationalIdNo
            }
        });

    } catch (err) {
        console.log("ERROR: getPrivateUserInfoController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getPrivateUserInfoController;
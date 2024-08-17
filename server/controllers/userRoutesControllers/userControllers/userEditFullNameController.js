import User from "../../../models/User.js";
import crypto from "crypto";

import mokaUpdateSubsellerRequest from "../../../utils/mokaPosRequests/mokaSubsellerRequests/mokaUpdateSubsellerRequest.js";

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const userEditFullNameController = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let fullName = req.body.fullname;

        let nameParts = fullName.split(' ');

        if( nameParts.length < 2 ){
            return res.status(400).json({
                error: true,
                message: "Full Name must contain at least 2 parts"
            });
        }

        let firstName = capitalize(nameParts[0]);
        let middleName = nameParts.slice(1, -1).map(capitalize).join(' ');
        let lastName = capitalize(nameParts[nameParts.length - 1]);

        let user = await User.findById(userId);

        user.identity.firstName = firstName;
        user.identity.middleName = middleName;
        user.identity.lastName = lastName;

        user.markModified('identity');

        if( user.careGiveGUID ){
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

            const mokaRequest = await mokaUpdateSubsellerRequest(
                user.careGiveGUID,
                firstName,
                middleName,
                lastName,
                user.email,
                nationalIdNo,
                user.phone,
                user.identity.openAdress,
                user.iban
            )

            if( !mokaRequest ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Internal server error"
                });
            }

            if( mokaRequest.error ){
                return res.status( 500 ).json({
                    error: true,
                    message: paramRequest.response.data.sonucStr
                });
            }

            if( mokaRequest.data.sonuc !== 1 ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Internal server error",
                    data: mokaRequest.data.sonucStr
                });
            }
        }

        await user.save();

        return res.status(200).json({
            error: false,
            message: "Full Name Updated Succesfuly",
            data: {
                firstName: user.identity.firstName,
                middleName: user.identity.middleName,
                lastName: user.identity.lastName
            }
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default userEditFullNameController;
import User from "../../../models/User.js";
import crypto from "crypto";
import mokaUpdateSubsellerRequest from "../../../utils/mokaPosRequests/mokaSubsellerRequests/mokaUpdateSubsellerRequest.js";

const userEditAdressController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const { country, city, lat, lng, openAdress } = req.body;

        if( !country || !city || !lat || !lng || !openAdress ){
            return res.status( 400 ).json({
                error: true,
                message: "Country, city, lat, lng and openAdress are required"
            });
        }

        let user = await User.findById( userId );
        user.identity.openAdress = openAdress;
        user.location.country = country;
        user.location.city = city;
        user.location.lat = lat;
        user.location.lng = lng;
        user.markModified( 'identity' );
        user.markModified( 'location' );

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
                user.identity.firstName,
                user.identity.middleName,
                user.identity.lastName,
                user.email,
                nationalIdNo,
                user.phone,
                openAdress,
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

        return res.status( 200 ).json({
            error: false,
            message: "Adress Updated Succesfuly",
            data: {
                country: user.location.country,
                city: user.location.city,
                lat: user.location.lat,
                lng: user.location.lng,
                openAdress: user.identity.openAdress
            }
        });
    }catch ( err ){
        console.error( err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default userEditAdressController;
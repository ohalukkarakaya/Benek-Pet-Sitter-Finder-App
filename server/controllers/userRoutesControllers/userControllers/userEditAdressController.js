import User from "../../../models/User.js";

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
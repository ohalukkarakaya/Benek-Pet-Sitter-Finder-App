import User from "../../../models/User.js";

const getUsersByTagController = async ( req, res ) => {
    try{
        const lastItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const petId = req.body.petId;
        const speciesId = req.body.speciesId;

        if( !petId || !speciesId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Params"
            });
        }

        const petTag = { petId: petId, speciesId: speciesId };

        const userQuery = { interestingPetTags: { $in: [ petTag ] } };
        const userFilter = [ { interestingPetTags: { $in: [ petTag ] } } ];
        if( lastItemId !== 'null' ){
            const lastItem = await User.findById(lastItemId);
            if(lastItem){
                userFilter.push( { createdAt: { $gt: lastItem.createdAt } } );
            }
        }

        const totalUserCount = await User.countDocuments( userQuery );
        const users = await User.find( userFilter ).sort({ createdAt: 1 }).limit( limit );

        return res.status( 200 ).json({
            error: false,
            message: "User List Prepared Succesfully",
            totalUserCount: totalUserCount,
            users: users
        });

    }catch( err ){
        console.log( "ERROR: getUsersByTagController - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getUsersByTagController;
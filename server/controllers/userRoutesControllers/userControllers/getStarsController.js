import User from "../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getStarsController = async (req, res) => {
    try{
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                error: true,
                message: "userId is required"
            });
        }

        const user = await User.findById(userId);

        if (!user || user.deactivation.isDeactive ) {
            return res.status(404).json({
                error: true,
                message: "user not found"
            });
        }

        let starList = [];
        for( let star of user.stars ){
            let owner = await User.findById(star.ownerId);
            if( !owner || owner.deactivation.isDeactive ){
                continue;
            }
            let ownerInfo = getLightWeightUserInfoHelper(owner);

            let pet = await Pet.findById(star.petId);
            if( !pet ){
                continue;
            }
            let petInfo = getLightWeightPetInfoHelper(pet);

            starList.push({
                owner: ownerInfo,
                pet: petInfo,
                star: star.star,
                date: star.date
            });
        }

        return res.status(200).json({
            error: false,
            stars: starList,
        });
    }catch (e) {
        condole.log("Error: getStarsController - ", e);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }

}

export default getStarsController;
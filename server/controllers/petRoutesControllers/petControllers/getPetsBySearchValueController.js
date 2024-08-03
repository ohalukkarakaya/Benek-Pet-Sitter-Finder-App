import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getPetsBySearchValueController = async (req, res) => {
    try {
        const searchTerm = req.params.searchValue.toString();
        const limit = parseInt(req.params.limit) || 10;
        const lastItemId = req.params.lastItemId || 'null';

        let searchTermsArray = searchTerm.split(' ');

        const pets = await Pet.find({
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                ...searchTermsArray.map(term => ({
                    name: { $regex: term, $options: "i" }
                })),
                { bio: { $regex: searchTerm, $options: "i" } },
                ...searchTermsArray.map(term => ({
                    bio: { $regex: term, $options: "i" }
                }))
            ]
        });

        const petInfoList = await Promise.all(pets.map(pet => getLightWeightPetInfoHelper(pet)));

        const skip = lastItemId !== 'null' ? petInfoList.findIndex(item => item._id.toString() === lastItemId) + 1 : 0;
        const resultList = petInfoList.slice(skip, skip + limit);

        return res.status(200).json({
            error: false,
            totalDataCount: petInfoList.length,
            pets: resultList,
        });

    } catch (err) {
        console.log("ERROR: getPetsBySearchValueController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

export default getPetsBySearchValueController;

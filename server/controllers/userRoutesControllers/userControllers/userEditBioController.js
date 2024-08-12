import User from "../../../models/User.js";

const userEditBioController = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let user = await User.findById(userId);

        if( !req.body.bio ){
            return res.status(400).json({
                error: true,
                message: "Bio is required"
            });
        }

        if( !( req.body.bio.length <= 150 ) ){
            return res.status(400).json({
                error: true,
                message: "Bio must be less than 150 characters"
            });
        }

        user.identity.bio = req.body.bio;
        user.markModified('identity');
        await user.save();

        return res.status(200).json({
            error: false,
            message: "Bio Updated Succesfuly",
            data: user.identity.bio
        });

    }catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default userEditBioController;
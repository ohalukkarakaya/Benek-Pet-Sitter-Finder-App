import User from "../../../models/User.js";

const getStarCountController = async (req, res) => {
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

        return res.status(200).json({
            error: false,
            starCount: user.stars.length,
        });
    }catch (e) {
        console.log("Error: getStarCountController - ", e);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getStarCountController;
const updateProfileImageController = async (req, res) => {
    try {
        await req.user.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
            }
        );
        return res.status(200).json({
            error: false,
            message: "Profile Image Updated Succesfuly",
            data: req.user.profileImg
        });


    }catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default updateProfileImageController;
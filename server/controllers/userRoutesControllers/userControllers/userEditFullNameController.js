import User from "../../../models/User.js";

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const userEditFullNameController = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let fullName = req.body.fullname;

        let nameParts = fullName.split(' ');

        let firstName = capitalize(nameParts[0]);
        let middleName = nameParts.slice(1, -1).map(capitalize).join(' ');
        let lastName = capitalize(nameParts[nameParts.length - 1]);

        let user = await User.findById(userId);

        user.identity.firstName = firstName;
        user.identity.middleName = middleName;
        user.identity.lastName = lastName;

        user.markModified('identity');
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
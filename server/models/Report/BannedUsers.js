import mongoose from "mongoose";

const BannedUsersSchema = new mongoose.Schema(
    {
        adminId: { type: String, required: true },
        userEmail: { type: String, required: true },
        userPhoneNumber: { type: String, required: true },
        userFullName: { type: String, required: true },
        adminDesc: {
            type: String,
            required: true,
            maxLength: [
                50,
                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
            ],
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model( "BannedUsers", BannedUsersSchema );
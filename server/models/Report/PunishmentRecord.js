import mongoose from "mongoose";

const PunishmentRecordSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        punishmentList: [
            {
                adminId: { type: String },
                adminDesc: {
                    type: String,
                    maxLength: [
                        50,
                        '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                    ],
                },
                createdAt: { type: Date, default: Date.now() }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model( "PunishmentRecord", PunishmentRecordSchema );
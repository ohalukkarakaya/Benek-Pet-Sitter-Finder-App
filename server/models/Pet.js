import mongoose from "mongoose";

const Schema = mongoose.Schema;

const petSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
        },
        bio: {
            type: String,
            maxLength: [
                150,
                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
            ],
        },
        sex: {
            type: String,
            enum: [ "Male", "Female" ]
        },
        birthDay: {
            type: Date,
        },
        kind: {
            type: String
        },
        breed: {
            type: String,
            required: true
        },
        vaccinations: {
            type: Array,
            default: []
        },
        careGiverHistory: {
            type: Array,
            default: []
        },
        primaryOwner: {
            type: String,
            required: true
        },
        allOwners: {
            type: Array,
            default: []
        },
        savers: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: true
    }
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
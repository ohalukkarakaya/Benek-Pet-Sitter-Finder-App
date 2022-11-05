import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        identity: {
            firstName: {
                type: String,
                required: true,
                maxLength: [
                    10,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            middleName: {
                type: String,
                maxLength: [
                    10,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            lastName: {
                type: String,
                required: true,
                maxLength: [
                    20,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            job: {
                type: String,
                maxLength: [
                    30,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            certificates: {
                type: Array,
                default: []
            },
            bio: {
                type: String,
                maxLength: [
                    150,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        iban: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        location: {
            required: true,
            country: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            lat: {
                type: String,
                required: true
            },
            lng: {
                type: String,
                required: true
            },
        },
        profileImgUrl: {
            type: String
        },
        pets: {
            type: Array,
            default: []
        },
        isCareGiver: {
            type: Boolean,
            default: false
        },
        pastCaregivers: {
            type: Array,
            default: []
        },
        caregiverCareer: {
            type: Array,
            default: []
        },
        savedUsersOrPets: {
            type: Array,
            default: []
        },
        savers: {
            type: Array,
            default: []
        },
        stars: {
            type: Array,
            default: []
        },
        depandedUsers: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;
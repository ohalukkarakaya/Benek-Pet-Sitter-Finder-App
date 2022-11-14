import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        identity: {
            "description": "idetitiy informations of the user",
            "type": "object",
            "firstName": {
                type: String,
                required: true,
                maxLength: [
                    10,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            "middleName": {
                type: String,
                maxLength: [
                    10,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            "lastName": {
                type: String,
                required: true,
                maxLength: [
                    20,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            "job": {
                type: String,
                maxLength: [
                    30,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            "certificates": {
                type: Array,
                default: []
            },
            "bio": {
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
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        location: {
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
        profileImg: {
            isDefaultImg: {
                type: Boolean,
                default: true,
            },
            recordedImgName: {
                type: String,
                default: "",
            },
            imgUrl: {
                type: String,
                default: ""
            },
        },
        coverImg: {
            isDefaultImg: {
                type: Boolean,
                default: true,
            },
            recordedImgName: {
                type: String,
                default: "",
            },
            imgUrl: {
                type: String,
                default: ""
            },
        },
        trustedIps: {
            type: Array,
            default: []
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
        saved: {
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

export default mongoose.model("User", UserSchema);
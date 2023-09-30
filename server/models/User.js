import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        authRole: {
            type: Number,
            enum: [ 0, 1, 2, 3, 4 ], // 0 - sıradan kullanıcı, 1 - super admin, 2 - developer, 3 - editor, 4 - muhasebe
            default: 0,
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
            "nationalId": {
                "isTcCitizen": {
                    type: Boolean,
                    default: true
                },
                "iv": {
                    type: String
                },
                "idNumber": {
                    type: String
                }
            },
            "birthDay:": {
                type: String
            },
            "openAdress": {
                type: String,
                maxLength: [
                    200,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            "job": {
                type: String,
                default: null,
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
                default: null,
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
            default: null
        },
        iban: {
            type: String
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
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            },
        },
        cardGuidies: [
            {
                cardName: {
                    type: String
                },
                cardGuid: {
                    type: String
                }
            }
        ],
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
        trustedIps: [ String ],
        isLoggedInIpTrusted: {
            type: Boolean,
            default: true,
        },
        pets: {
            type: Array,
            default: []
        },
        isCareGiver: {
            type: Boolean,
            default: false
        },
        careGiveGUID: {
            type: String
        },
        pastCaregivers: {
            type: Array,
            default: []
        },
        caregiverCareer: {
            type: Array,
            default: []
        },
        followingUsersOrPets: {
            type: Array,
            default: []
        },
        blockedUsers: {
            type: Array,
            default: []
        },
        followers: {
            type: Array,
            default: []
        },
        saved: {
            type: Array,
            default: []
        },
        stars: [
            {
                ownerId: {
                    type: String,
                    required: true
                },
                petId: {
                    type: String,
                    required: true
                },
                star: {
                    type: Number,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
        ],
        dependedUsers: {
            type: Array,
            default: []
        },
        interestingPetTags: [ 
            {
                petId: String,
                speciesId: String
            }
        ],
        deactivation: {
            isDeactive: {
                type: Boolean,
                default: false
            },
            deactivationDate: {
                type: Date,
            },
            isAboutToDelete: {
                type: Boolean,
                default: false
            }
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);
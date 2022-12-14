import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
      name: {
          type: String,
          required: true,
      },
      petProfileImg: {
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
      petCoverImg: {
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
      images: [
        {
            imgUrl: {
                type: String,
                required: true,
            },
            likes: [ String ],
            comments: [
                {
                    userId: {
                        type: String,
                        required: true,
                    },
                    comment: {
                        type: String,
                        maxLength: [
                            50,
                            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                        ],
                    },
                    likes: [ String ],
                    replies: [
                        {
                            userId: {
                                type: String,
                                required: true
                            },
                            reply: {
                                type: String,
                                maxLength: [
                                    50,
                                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                                ],
                            },
                            likes: [ String ],
                        }
                    ]
                }
            ]
        }
      ],
      birthDay: {
          type: Date,
      },
      kind: {
          type: String
      },
      species: {
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
      handOverRecord: [
        {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            price: String,
            date: {
                type: Date,
                default: Date.now()
            }
        }
      ],
      followers: {
          type: Array,
          default: []
      },
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Pet", PetSchema);
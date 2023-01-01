import mongoose from "mongoose";

const CareGiveSchema = new mongoose.Schema(
  {
      invitation: {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true,
        },
        at: {
            type: Date,
            default: Date.now()
        },
        isAccepted: {
            type: Boolean,
            default: false
        },
        actionCode: {
            codeType: {
                type: String,
                enum: [ "Start", "Finish", "Done" ],
                required: true
            },
            codePassword: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
      },
      isStarted: {
        type: Boolean,
        default: false
      },
      finishProcess: {
        isFinished: {
            type: Boolean,
            default: false,
        },
        finishDate: Date
      },
      petId: {
        type: String,
        required: true
      },
      careGiver: {
        careGiverId: {
            type: String,
            required: true
        },
        careGiverContact: {
            careGiverPhone: {
                type: String,
                required: true
            },
            careGiverEmail: {
                type: String,
                required: true
            }
        }
      },
      petOwner: {
        petOwnerId: {
            type: String,
            required: true
        },
        petOwnerContact: {
            petOwnerEmail: {
                type: String
            },
            petOwnerPhone: {
                type: String,
            }
        }
      },
      prices: {
        servicePrice: {
            priceType: {
                type: String,
                enum: [ "Free", "TL", "USD", "EUR" ],
                default: "Free"
            },
            price: {
                type: Number,
                default: 0,
            }
        }
      },
      startDate: {
        type: Date,
        default: Date.now()
      },
      endDate: {
        type: Date,
        default: Date.now() + 7*24*60*60*1000,
        validate: [
            function (value) {
                const startDate = Date.parse(this.startDate);
                return startDate < Date.parse(value);
            }
        ]
      },
      adress: {
        adressDesc: {
            type: String,
            maxLength: [
                100,
                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
            ],
        },
        lat: {
            type: String,
            required: true,
        },
        long: {
            type: String,
            required: true
        }
      },
      missionCallender: [
        { 
            missionDesc: {
                type: String,
                maxLength: [
                    150,
                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                ],
            },
            missionDate: {
                type: Date,
                required: true
            },
            missionDeadline: {
                type: Date,
                required: true,
                validate: [
                    function (value) {
                        const startDate = Date.parse(this.missionDate);
                        return startDate < Date.parse(value);
                    }
                ]
            },
            missionAcception: {
                isMissionAccepted: {
                    type: Boolean,
                    default: false,
                },
                ReasonToMakeExtra: {
                    type: String
                }
            },
            extra: {
                isExtra: {
                    type: Boolean,
                    default: false
                },
                isExtraAccepted: {
                    type: Boolean,
                    default: false
                },
                extraServicePrice: {
                    priceType: {
                        type: String,
                        enum: [ "NotExtra", "TL", "USD", "EUR" ],
                        default: "NotExtra"
                    },
                    price: {
                        type: Number,
                        default: 0,
                    }
                }
            },
            missionContent:{
                timeSignature: {
                    timePassword: {
                        type: String,
                        required:true
                    },
                    expiresAt: {
                        type: Date,
                        default: Date.now() + 10 * 60 * 1000
                    }
                },
                videoUrl: {
                    type: String,
                    required: true,
                },
                isApproved: {
                    type: Boolean,
                    default: false
                }
            },
        }
      ]
  },
  {
      timestamps: true
  }
);

export default mongoose.model("CareGive", CareGiveSchema);
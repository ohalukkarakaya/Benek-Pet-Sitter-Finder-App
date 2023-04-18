import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
      eventAdmin: {
        type: String,
        required: true,
      },
      eventAdminsParamGuid: {
        type: String,
        required: true
      },
      eventOrganizers: [ String ],
      desc: {
        type: String,
        maxLength: [
            150,
            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
        ],
      },
      imgUrl: {
        type: String,
        required: true
      },
      ticketPrice: {
        priceType: {
            type: String,
            enum: [ "Free", "TL", "USD", "EUR" ],
            default: "Free"
        },
        price: {
            type: Number,
            default: 0,
        }
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
      maxGuests: {
        type: Number,
        //-1 means no limit
        default: -1
      },
      date: {
        type: Date,
        required: true
      },
      expiryDate: {
        type: Date,
        required: true,
        validate: [
            function (value) {
                const eventDate = Date.parse(this.date)
                return new Date( eventDate + 7*24*60*60*1000 ).toString() === value.toString();
            }
        ]
      },
      afterEvent: [
        {
            userId: {
                type: String,
                required: true
            },
            content: {
                isUrl: {
                    type: Boolean,
                    default: false
                },
                value: {
                    type: String,
                    required: true,
                }
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
            likes: [ String ],
            comments: [
                {
                    userId: {
                        type: String,
                        required: true
                    },
                    comment: {
                        type: String,
                        requred: true,
                        maxLength: [
                            50,
                            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                        ],
                    },
                    likes: [ String ],
                    createdAt: {
                        type: Date,
                        default: Date.now(),
                    },
                    replies: [
                        {
                            userId: {
                                type: String,
                                required: true
                            },
                            reply: {
                                type: String,
                                required: true,
                                maxLength: [
                                    50,
                                    '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                                ],
                            },
                            likes: [ String ],
                            createdAt: {
                                type: Date,
                                default: Date.now(),
                            },
                        }
                    ]
                }
            ]
        }
      ],
      isPrivate: {
        type: Boolean,
        default: false
      },
      willJoin: [ String ],
      joined: [ String ],
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Event", EventSchema);
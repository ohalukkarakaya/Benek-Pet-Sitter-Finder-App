import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
      eventAdmin: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        maxLength: [
            150,
            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
        ],
      },
      ticketPrice: {
        priceType: {
            type: String,
            required: true,
            enum: [ "Free", "TL", "USD", "EUR" ],
            default: "Free"
        },
        price: {
            type: Number,
            default: 0,
            required: true
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
        default: -1
      },
      date: {
        type: Date,
        required: true
      },
      expiryDate: {
        type: Date,
        validate: [
            function (value) {
                return Date( this.date + 7*24*60*60*1000 ) === value;
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
                type: String,
                required: true,
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
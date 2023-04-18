import mongoose from "mongoose";

const EventTicketSchema = new mongoose.Schema(
  {
      eventOrganizers: [ String ],
      eventId: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      ticketPassword: {
        type: String,
        required: true,
      },
      paidPrice: {
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
      orderId: {
        type: String
      },
      orderInfo: {
        pySiparisGuid: {
          type: String,
          required: true
        },
        sanalPosIslemId: {
          type: String,
          required: true
        },
        subSellerGuid: {
          type: String,
          required: true
        }
      },
      boughtAt: {
        type: Date,
        dafeult: Date.now()
      },
      eventDate: {
        type: Date,
        required: true
      },
      expiryDate: {
        type: Date,
        required: true,
        validate: [
            function (value) {
                const eventDate = Date.parse(this.eventDate);
                return new Date( eventDate + 7*24*60*60*1000 ).toString() === value.toString();
            }
        ]
      },
      isPrivate: {
        type: Boolean,
        default: false
      },
      ticketUrl: {
        type: String
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("EventTicket", EventTicketSchema);
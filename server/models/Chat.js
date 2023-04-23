import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
      members: [
        {
          userId: {
            type: String,
            requred: true
          },
          joinDate: {
            type: Date,
            default: Date.now()
          }
        },
      ],
      chatStartDate: {
        type: Date,
        default: Date.now()
      },
      chatName: {
        type: String
      },
      chatDesc: {
        type: String
      },
      chatImageUrl: {
        type: String
      },
      messages: [
      {
        sendedUserId: {
            type: String,
            required: true
        },
        messageType: {
            type: String,
            enum: [ "Text", "File", "PaymentOffer", "UserProfile", "PetProfile" ]
        },
        IdOfTheUserWhichProfileSended: {
            type: String
        },
        IdOfThePetWhichProfileSended: {
            type: String
        },
        fileUrl: {
            type: String
        },
        message: {
            type: String
        },
        PaymentOffer: {
            receiverUserId: {
                type: String,
                required: true
            },
            paymentType: {
                type: String,
                enum: [ "EventTicket", "CareGive" ],
                required: true
            },
            releatedSchemaId: {
                type: String,
                required: true
            }
        },
        seenBy: [ String ],
        sendDate: {
            type: Date,
            default: Date.now()
        },
      }
    ]
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Chat", ChatSchema);
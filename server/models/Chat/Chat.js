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
      meeting: [
        {
          date: {
            type: Date,
            default: Date.now()
          },
          meetingEndDate: {
            type: Date,
            default: null
          },
          joinedUsers: [
            {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "MeetingUser"
            }
          ]
        }
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
            enum: [ "Text", "File", "PaymentOffer", "UserProfile", "PetProfile", "Event" ]
        },
        IdOfTheUserOrPetWhichProfileSended: {
            type: String
        },
        fileUrl: {
            type: String
        },
        message: {
            type: String
        },
        paymentOffer: {
            receiverUserId: {
                type: String,
                required: true
            },
            paymentType: {
                type: String,
                enum: [ "EventInvitation", "CareGive" ],
                required: true
            },
            releatedrecordId: {
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
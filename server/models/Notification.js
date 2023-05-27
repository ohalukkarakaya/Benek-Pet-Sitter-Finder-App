import mongoose from "mongoose";

const schema = mongoose.Schema;

const NotificationSchema = new schema(
    {
        from: {
            type: String,
            required: true
        },
        to: [
            {
                type: String,
                required: true
            }
        ],
        seenBy: [ String ],
        openedBy: [ String ],
        releatedContent: {
            id: {
                type: String,
                required: true
            },
            contentType:{
                type: String,
                enum: [ 
                    "follow", 
                    "message",
                    "star",
                    "petImageComment",
                    "petImageReply",
                    "storyComment",
                    "storyReply",
                    "eventComment",
                    "eventReply",
                    "eventInvitation", 
                    "careGiveInvitation",
                    "secondaryPetOwnerInvitation" ,
                    "petHandOverInvitation",
                    "newMission",
                    "missionUpload",
                    "missionAprove",
                    "emergency"
                ],
                required: true
            }
        },
        parentContent: {
            id: {
                type: String,
            },
            contentType:{
                type: String,
                enum: [ 
                    "petImage",
                    "petImageComment",
                    "story",
                    "storyComment",
                    "event",
                    "eventComment",
                    "careGive",
                    "pet"
                ],
            }
        },
        secondParentContent: {
            id: {
                type: String,
            },
            contentType:{
                type: String,
                enum: [ 
                    "pet",
                    "petImage",
                    "story",
                    "event"
                ],
            }
        },
        thirdParentContent: {
            id: {
                type: String,
            },
            contentType:{
                type: String,
                enum: [ 
                    "pet"
                ],
            }
        },
        date: {
            type: Date,
            default: Date.now(),
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Notification",
    NotificationSchema
);
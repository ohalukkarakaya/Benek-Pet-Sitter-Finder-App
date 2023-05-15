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
        releatedContent: {
            id: {
                type: String,
                required: true
            },
            contantType:{
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
                required: true
            },
            contantType:{
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
                required: true
            }
        },
        secondParentContent: {
            id: {
                type: String,
                required: true
            },
            contantType:{
                type: String,
                enum: [ 
                    "petImage",
                    "story",
                    "event",
                ],
                required: true
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

const Story = mongoose.model(
    "Notification",
    NotificationSchema
);

export default Story;
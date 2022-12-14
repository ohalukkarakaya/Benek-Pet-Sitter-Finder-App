import mongoose from "mongoose";

const schema = mongoose.Schema;

const StorySchema = new schema(
    {
        userId: {
            type: String,
            required: true
        },
        about: {
            id: {
                type: String,
                required: true
            },
            aboutType:{
                type: String,
                enum: [ "pet", "user", "event" ],
                required: true
            }
        },
        contentUrl: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        expiresAt: {
            type: Date,
            default: Date.now() + 86400000
        },
    }
);

const Story = mongoose.model(
    "Story",
    StorySchema
);

export default Story;
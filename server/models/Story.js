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
        desc: {
            type: String,
            maxLength: [
                50,
                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
            ],
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
        likes: [ String ],
        comments: [
            {
                userId: {
                    type: String,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                    maxLength: [
                        50,
                        '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                    ],
                },
                createdAt: {
                    type: Date,
                    default: Date.now(),
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
                            required: true,
                            maxLength: [
                                50,
                                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
                            ],
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now(),
                        },
                        likes: [ String ],
                    }
                ]
            }
        ],
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Story",
    StorySchema
);
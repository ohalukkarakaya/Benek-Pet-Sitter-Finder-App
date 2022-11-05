import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        iban: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        location: {
            required: true,
            "country": {
                type: String,
                required: true
            },
            "city": {
                type: String,
                required: true
            },
            "lat": {
                type: String,
                required: true
            },
            "lng": {
                type: String,
                required: true,
            },
        },
        profileImgUrl: {
            type: String,
        },
        pets: [
            {
                type: String
            }
        ]
    }
)
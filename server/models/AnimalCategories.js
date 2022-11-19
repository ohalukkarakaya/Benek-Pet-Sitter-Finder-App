import mongoose from "mongoose";

const AnimalCategories = new mongoose.Schema(
  {
    category: {
        tr: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    animalName: [ 
        {
            tr: {
                type: String,
                required: true
            },
            en: {
                type: String,
                required: true
            }
        }
     ]
  }
);

export default mongoose.model("AnimalCategories", AnimalCategories);
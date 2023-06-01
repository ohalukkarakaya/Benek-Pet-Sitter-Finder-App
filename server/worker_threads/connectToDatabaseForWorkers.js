import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(
      env.DB, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }catch( error ){
    console.error("MongoDB bağlantı hatası:", error);
  }
};

export default connectToDatabase;
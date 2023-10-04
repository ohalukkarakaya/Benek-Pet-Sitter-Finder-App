import mongoose from "mongoose";

const AdminLoginCodeSchema = new mongoose.Schema(
    {
        clientId: { type: String, required: true },
        codePassword: { type: String, required: true },
        createdAt: { type: Date, default: Date.now() }
    },
    {
        timestamps: true
    }
  );

  export default mongoose.model( "AdminLoginCode", AdminLoginCodeSchema );
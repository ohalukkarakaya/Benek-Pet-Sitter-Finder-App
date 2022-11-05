import mongoose from "mongoose";

const dbConnect = () => {
    const connectionParams = { useNewUrlParser: true };
    mongoose.connect(process.env.DB, connectionParams);

    mongoose.connection.on(
        "connected",
        () => {
            console.log("DB Status: Connected");
        }
    );

    mongoose.connection.on(
        "error",
        (err) => {
            console.log("DB Status: Error Occured");
        }
    );

    mongoose.connection.on(
        "disconnected",
        () => {
            console.log("DB Status: Disconnected");
        }
    );
};

export default dbConnect;
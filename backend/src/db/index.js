import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Starting Mongo connection...");

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)

        console.log(
            `MONGO DB CONNECTED: ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.error("MONGO DB ERR:", err);
        throw err;
    }
};

export default connectDB;
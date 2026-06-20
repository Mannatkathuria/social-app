import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URL,
            {
                serverSelectionTimeoutMS: 5000
            }
        );

        console.log(
            `MongoDB connected: ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.error("Mongo error:", err);
        throw err;
    }
};

export default connectDB;
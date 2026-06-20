import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

console.log(process.env.MONGODB_URL);

try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("CONNECTED");
} catch (err) {
    console.error(err);
}
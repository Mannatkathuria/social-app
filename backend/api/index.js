import serverless from "serverless-http";
import app from "../src/app.js";
import connectDB from "../src/db/index.js";

let isConnected = false;

async function handler(req, res) {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }

    return serverless(app)(req, res);
}

export default handler;
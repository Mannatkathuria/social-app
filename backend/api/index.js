import serverless from 'serverless-http';
import app from '../src/app.js';

// Connect to MongoDB on cold start
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import connectDB from '../src/db/index.js';

let isConnected = false;

async function handler(event, context) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
  return serverless(app)(event, context);
}

export default handler;
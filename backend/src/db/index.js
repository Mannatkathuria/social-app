import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MONGO DB CONNECTED: ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.log("MONGO DB ERR:", err)
        process.exit(1)
    }
}

export default connectDB
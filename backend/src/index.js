// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
dotenv.config({path: './.env'})

import connectDB from './db/index.js'
import express from 'express'
import app from './app.js'

// const app = express()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server runnning at ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED", err)
})


// export default app

/*
import mongoose from 'mongoose'
import { DB_NAME } from './constants';
import express from 'express'
const App = express()

;import { DB_NAME } from './constants';
( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        App.on("error",(err) => {
            console.log("ERR:", err);
            throw(err)
        })

        App.listen(process.env.PORT, () => {
            console.log(`App is working on PORT ${process.env.PORT}`)
        })
    }
    catch(err) {
        console.error("ERROR:", err)
        throw err
    }
}) ()

*/
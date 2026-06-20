import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://social-frontend-ctxnndvx5-mannatkathuria23-2294s-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/users.routes.js'

app.use("/api/v1/users", userRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    
    return res.status(statusCode).json({
        success: err.success || false,
        statusCode: statusCode,
        message: message,
        errors: err.errors || []
    });
});

export default app
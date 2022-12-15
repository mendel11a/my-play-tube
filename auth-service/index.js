import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"

const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(()=>{
        console.log("Auth Service Connected to DB");
    }).catch((err)=>{
        throw err
    })
}

app.use(cookieParser())
app.use(express.json()) //to allow app to take json file from outside
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.use((err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
}) //middleware that helps handling error in express

app.listen(5500, () => {
    connect()
    console.log("Connected to Auth-Service!");
})
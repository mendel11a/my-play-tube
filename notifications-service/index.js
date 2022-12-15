import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import notificationRoutes from "./routes/notifications.js"
import cookieParser from "cookie-parser"
import amqp from "amqplib"
import { consumeMessages } from "./consumer.js"


const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(()=>{
        console.log("Notification Service Connected to DB");
    }).catch((err)=>{
        throw err
    })
}


app.use(cookieParser())
app.use(express.json()) //to allow app to take json file from outside
app.use("/api/notifications",notificationRoutes)

consumeMessages()

app.use((err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
}) //middleware that helps handling error in express

app.listen(6600, () => {
    connect()
    console.log("Connected to Notification-Service!");
})
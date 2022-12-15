import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true, 
    }

}, { timestamps: true }
)

export default mongoose.model("Notification", NotificationSchema)
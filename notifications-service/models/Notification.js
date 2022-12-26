import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }
)

export default mongoose.model("Notification", NotificationSchema)
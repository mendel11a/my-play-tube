import express from "express"
import { addNotification, deleteNotification, getNotifications, getUnReadNotifications, updateNotification } from "../controllers/notification.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//create a video
router.post("/", verifyToken, addNotification)
// get notifications
router.get("/", verifyToken, getNotifications)
// get unread notifications
router.get("/unread", verifyToken, getUnReadNotifications)
// update notification
router.put("/", verifyToken, updateNotification)
//delete video
router.delete("/:id", verifyToken, deleteNotification)

export default router
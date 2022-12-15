import express from "express"
import { addNotification, deleteNotification } from "../controllers/notification.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//create a video
router.post("/", verifyToken, addNotification)

//delete video
router.delete("/:id", verifyToken, deleteNotification)

export default router
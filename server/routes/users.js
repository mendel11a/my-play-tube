import express from "express"
import { deleteUser, getUser, like, subscribe, disLike, update, unSubscribe } from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//update user
router.put("/:id", verifyToken, update)

//delete user
router.delete("/:id", verifyToken, deleteUser)

//get a user
router.get("/find/:id", getUser)

//subscribe to a channel
router.put("/sub/:channelId", verifyToken, subscribe) 

//unsubscribe to a channel
router.put("/unsub/:channelId", verifyToken, unSubscribe) 

//like a video
router.put("/like/:videoId", verifyToken, like)

//unlike a video
router.put("/dislike/:videoId", verifyToken, disLike)

export default router
import express from "express"
import { addVideo, addView, deleteVideo, fans, getByTag, getVideo, random, search, sendLog, sub, trend, updateVideo } from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//create a video
router.post("/", verifyToken, addVideo)

//send log
router.post("/sendLog", sendLog)

//update video
router.put("/:id", verifyToken, updateVideo)

//delete video
router.delete("/:id", verifyToken, deleteVideo)

//get video
router.get("/find/:id", getVideo)

//increment views video
router.put("/view/:id", addView)

//get trend video
router.get("/trend", trend)

//get random videos
router.get("/random", random)

//get videos of user i subscribed to
router.get("/sub", verifyToken, sub)

//get users that subscribed to me
router.get("/fans",verifyToken, fans)

//get videos by tags
router.get("/tags", getByTag)

//get videos by search
router.get("/search/", search)


export default router
import express from "express"
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//create a video
router.post("/", verifyToken, addVideo)

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

//get subscribed users videos
router.get("/sub", verifyToken, sub)

//get videos by tags
router.get("/tags", getByTag)

//get videos by search
router.get("/search/", search)

export default router
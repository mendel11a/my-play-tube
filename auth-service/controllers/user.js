import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/Video.js"

export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    }
    else {
        return next(createError(403, "You can update only your account"))
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (err) {
            next(err)
        }
    }
    else {
        return next(createError(403, "You can delete only your account"))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.channelId }
        })
        await User.findByIdAndUpdate(req.params.channelId, {
            $inc: { subscribers: 1 }
        })
        res.status(200).json("You have subscribed successfully")
    } catch (err) {
        next(err)
    }
}

export const unSubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.channelId }
        })
        await User.findByIdAndUpdate(req.params.channelId, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json("You have subscribed successfully")
    } catch (err) {
        next(err)
    }
}

export const like = async (req, res, next) => {
    const videoId = req.params.videoId
    const id = req.user.id
    console.log(id);
    try {
        await Video.findOneAndUpdate({ _id: videoId }, {
            $addToSet: { likes: id },   // check if the id of the user is only one time in the array in difference of $push method
            $pull: { dislikes: id }  // if before we've disliked the video and now we want to like it, we have to remove the id from the dislike array
        })
        res.status(200).json("The video has been liked")
    } catch (err) {
        next(err)
    }
}

export const disLike = async (req, res, next) => {
    const videoId = req.params.videoId
    const id = req.user.id
    try {
        await Video.findOneAndUpdate({ _id: videoId }, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been disliked")
    } catch (err) {
        next(err)
    }
}
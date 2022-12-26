
import { createError } from "../error.js"
import Notification from "../models/Notification.js"
import User from "../models/User.js"
import Video from "../models/Video.js"

export const addNotification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers
        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                const newNotification = new Notification({ userId: req.body.userId, receiverId: channelId, videoId: req.body.videoId })
                const savedNotification = await newNotification.save()
                return savedNotification
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
    }
    catch (err) {
        next(err)
    }
}

export const getNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers
        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Notification.find({ userId: channelId, receiverId: req.user.id }).limit(15)
            })
        )
        const tempList = list.flat()
        const newList = await Promise.all(
            tempList.map(async (notification) => {
                const video = await Video.findById(notification.videoId);
                const user = await User.findById(notification.userId);
                const newNotification = { ...notification._doc, senderName: user.name,senderImage:user.img, videoUrl: video.videoUrl, videoImgUrl: video.imgUrl, videoTitle: video.title }
                return newNotification
            }))
        res.status(200).json(newList.flat().sort((a, b) => b.createdAt - a.createdAt)) // return sorted notifications from the newest to the latest
    } catch (err) {
        next(err)
    }
}

export const getUnReadNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers
        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Notification.find({ userId: channelId, receiverId: req.user.id, read: false })
            })
        )
        const tempList = list.flat()
        const newList = await Promise.all(
            tempList.map(async (notification) => {
                const video = await Video.findById(notification.videoId);
                const user = await User.findById(notification.userId);
                const newNotification = { ...notification._doc, senderName: user.name,senderImage:user.img, videoUrl: video.videoUrl, videoImgUrl: video.imgUrl }
                return newNotification
            }))
        res.status(200).json(newList.flat().sort((a, b) => b.createdAt - a.createdAt)) // return sorted notifications from the newest to the latest

    } catch (err) {
        next(err)
    }

}



export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id)
        if (!notification) return next(createError(404, "Notification not found"))

        if (req.user.id === notification.userId) {
            await Notification.findByIdAndDelete(req.params.id)
            res.status(200).json("Notification deleted")
        }
        else {
            return next(createError(403, "You can delete only your notification"))
        }
    } catch (err) {
        next(err)
    }
}

export const updateNotification = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ receiverId: req.body.receiverId, read: false })
        const notificationsIds = []
        notifications.forEach((notification) => notificationsIds.push(notification._id))
        if (!notifications) return next(createError(404, "Notifications not found"))

        if (req.user.id === req.body.receiverId) {
            const list = await Promise.all(
                notificationsIds.map(async (channelId) => {
                    const updatedNotification = await Notification.findByIdAndUpdate(channelId, {
                        $set: { ...req.body, read: true }
                    }, { new: true })
                    return updatedNotification
                })
            )
            res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
        }
        else {
            return next(createError(403, "You can update only your notification"))
        }
    } catch (err) {
        next(err)
    }
}

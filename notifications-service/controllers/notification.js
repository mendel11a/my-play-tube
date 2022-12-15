import { createError } from "../error.js"
import Notification from "../models/Notification.js"

export const addNotification = async (data) => {
    const newNotification = new Notification({userId:data.userId,description:data.message})
    const savedNotification = await newNotification.save()
    return savedNotification
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

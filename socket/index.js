import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:3000" // we can reach this server only inside the react app
    }
});

var onlineUsers = []

const addNewUser = (username, userImage, socketId) => {
    !onlineUsers.some(user => user.username === username) &&
        onlineUsers.push({ username, userImage, socketId })
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

const getUser = (userName) => {
    return onlineUsers.find((user) => user.username === userName)
}

io.on("connection", (socket) => {
    socket.on("newUser", (userName, userImage) => {
        addNewUser(userName, userImage, socket.id)
        console.log("??????????");
        console.log(onlineUsers);
        console.log("??????????");
    })

    socket.on("sendNotification",
        ({ senderName, senderImage, videoId, videoTitle, videoUrl, videImgUrl, receiverName }) => {
            const receivers = []
            console.log(onlineUsers);
            console.log("??????????");
            console.log(receiverName);
            console.log("??????????");
            receiverName.forEach((receiver) => receivers.push(getUser(receiver)))
            console.log(receivers);
            receivers.forEach((receiver) => receiver.username && io.to(receiver.socketId).emit("getNotification", { senderName, senderImage, videoId, videoTitle, videoUrl, videImgUrl }))
        }
    )

    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
});

io.listen(4000);
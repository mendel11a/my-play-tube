import amqp from "amqplib"
import dotenv from "dotenv"
import { rabbitMq } from "./config.js"
dotenv.config()

var channel = '';

export const createChannel = async () => {
    const connection = await amqp.connect(rabbitMq.url)
    channel = await connection.createChannel();
}

export const publishMessage = async ({ routingKey, message, userId }) => {
    if (!channel) {
        await createChannel();
    }

    const exchangeName = rabbitMq.exchangeName
    await channel.assertExchange(exchangeName, "direct")

    const logDetails = {
        logType: routingKey,
        message: message,
        userId: userId
    };
    await channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
        `The new ${routingKey} log is sent to exchange ${exchangeName}`
    );
}

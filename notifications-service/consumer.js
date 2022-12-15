import amqp from "amqplib"
import dotenv from "dotenv"
import {rabbitMq} from "./config.js"
import { addNotification } from "./controllers/notification.js"
dotenv.config()


export const consumeMessages = async () =>{
    const connection = await amqp.connect(rabbitMq.url)
    const channel = await connection.createChannel()
    
    const exchangeName = rabbitMq.exchangeName
    await channel.assertExchange(exchangeName, "direct")
  
    const q = await channel.assertQueue("NotificationQueue");
  
    await channel.bindQueue(q.queue, exchangeName, "Notification")
  
    channel.consume(q.queue, async(msg) => {
      const data = JSON.parse(msg.content)
      const notification= await addNotification(data)
      console.log(notification);
      channel.ack(msg); // notify rabbitmq that this message has been comsumed
    });
}
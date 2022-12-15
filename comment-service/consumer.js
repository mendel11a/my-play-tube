import amqp from "amqplib"
import dotenv from "dotenv"
import {rabbitMq} from "./config.js"
dotenv.config()


export const consumeMessages = async () =>{
    const connection = await amqp.connect(rabbitMq.url)
    const channel = await connection.createChannel()
    
    const exchangeName = rabbitMq.exchangeName
    await channel.assertExchange(exchangeName, "direct")
  
    const q = await channel.assertQueue("InfoQueue");
  
    await channel.bindQueue(q.queue, exchangeName, "Info")
  
    channel.consume(q.queue, (msg) => {
      const data = JSON.parse(msg.content)
      console.log(data);
      channel.ack(msg); // notify rabbitmq that this message has been comsumed
    });
}
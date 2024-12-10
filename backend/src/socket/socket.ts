import { Server } from 'socket.io'
import { joinRoom, sendMessage } from './event'
import Notification from '../models/Notifications'

export let io: Server

export const setSocket = (httpServer: any) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('joinchat', async (data: any) => {
            joinRoom(socket, data);
        });

        socket.on('send_message', async (message: any) => {
            console.log(message);
            sendMessage(socket, message);
        });

        socket.on("joinnotification", (data) => {
            console.log("joined notificatison", data?.id);
            console.log(`User ${socket.id} joined room: ${data?.id}`);
            socket.join(data?.id);
        });

        socket.on("sendNotification", async (data) => {
            console.log("Received data from client:", data);
            io.to(data.room).emit("notification", { message: data.message });
            await Notification.create({
                message: data.message,
                room_id: data.room,
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');

        });
    });
}


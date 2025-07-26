import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create Express app and HTTP Server
const app = express();
const server = http.createServer(app); // for socket.io

// Initialize socket.io server:
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users:
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler function
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

// Middleware Setup
app.use(express.json({limit: "4mb"})); // Limit is 4 MB
app.use(cors()); // It allows our frontend URL to connect to the backend

// Routes Setup
app.use('/api/status', (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connecting to MongoDB:
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is Running on Port: " + PORT));
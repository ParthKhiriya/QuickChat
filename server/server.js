// import dotenv from "dotenv";
// dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { connnectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


// Create Express app and HTTP Server
const app = express(); // Create an instance of express app
const server = http.createServer(app); // Using this HTTP server because the socket.io supports https server.

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
});

// Store online users:
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients:
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

// Middleware setup:
app.use(express.json({limit: "50mb"})); // So that data gets parsed to json and the limit is 50MB
app.use(cors()); // Allow all the URLs to connect to our backend

// Route setup
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connnectDB();

// Creating the Port:
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV != "production") {
    server.listen(PORT, () => {
        console.log("Server is Running on PORT: " + PORT);
    })
}

// Export server for vercel
export default server;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connnectDB } from "./lib/db.js";

dotenv.config();

// Create Express app and HTTP Server
const app = express(); // Create an instance of express app
const server = http.createServer(app); // Using this HTTP server because the socket.io supports https server.

// Middleware setup:
app.use(express.json({limit: "4mb"})); // So that data gets parsed to json and the limit is 4MB
app.use(cors()); // Allow all the URLs to connect to our backend

// Create a simple route:
app.use("/api/status", (req, res) => {
    res.send("Server is Live");
});

// Connect to MongoDB
await connnectDB();

// Creating the Port:
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server is Running on PORT: " + PORT);
})
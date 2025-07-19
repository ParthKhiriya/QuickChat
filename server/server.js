import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';

// Create Express app and HTTP Server
const app = express();
const server = http.createServer(app); // for socket.io

// Middleware Setup
app.use(express.json({limit: "4mb"})); // Limit is 4 MB
app.use(cors()); // It allows our frontend URL to connect to the backend
app.use('/api/status', (req, res) => res.send("Server is Live"));

// Connecting to MongoDB:
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is Running on Port: " + PORT));
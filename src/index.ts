import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { Server } from 'socket.io';

require('dotenv').config();

const app = express();

app.use(cors());

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', router());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room 
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });

    socket.on('privateMessage', (socketId, message) => {
        io.to(socketId).emit('message', message);
        console.log(`Message sent to client ${socketId}: ${message}`);
    });

    socket.on('reply', (message) => {
        console.log('Reply Message: ' + message);
        socket.broadcast.emit('reply', message); // Broadcast the message to all clients except the sender
    });

    socket

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT;

const DB_NAME = 'mrt';
const MONGO_URL = `mongodb+srv://limuelavellano:tDXICFdbL47FmFlL@mrt-ticketing-system.ag50wsx.mongodb.net/${DB_NAME}`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
    dbName: DB_NAME, // Specify the database name here
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`);
});
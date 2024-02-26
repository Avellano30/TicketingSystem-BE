import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'https://mrt-ticketing.onrender.com',
    credentials: true,
}));

app.options('*', cors());

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
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

app.use('/', router());

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`);
});
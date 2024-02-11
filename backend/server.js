import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import UserRouter from './Router/UserRoute.js';
import Adminrouter from './Router/adminRoute.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from all origins
app.use(cors());

// Add additional CORS headers to allow WebSocket connections
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // Allow WebSocket connections
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Mongo connected'))
  .catch(() => console.log('Not connected'));

const server = http.createServer(app);

// Pass the server instance to the Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from all origins
    methods: ['GET', 'POST'], // Allow only GET and POST methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }
});

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.static(path.join('public')));
app.use('/api/user', UserRouter);
app.use('/api/admin', Adminrouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { io };

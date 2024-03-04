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
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Mongo connected'))
  .catch(() => console.log('Not connected'));

const server = http.createServer(app);

const io = new Server(server, {
  cors:true
});

const emailToSocketIdMap =new Map()
const socketidToEmailMap =new Map()

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

socket.on("room:join", (data) => {
  const { email, room } = data;
  emailToSocketIdMap.set(email, socket.id);
  socketidToEmailMap.set(socket.id, email);
  io.to(room).emit("user:joined", { email, id: socket.id });
  socket.join(room);
  io.to(socket.id).emit("room:join", data);
});

socket.on("user:call", ({ to, offer }) => {
  io.to(to).emit("incomming:call", { from: socket.id, offer });
});
socket.on("call:accepted", ({ to, ans }) => {
  io.to(to).emit("call:accepted", { from: socket.id, ans });
});
socket.on("peer:nego:needed", ({ to, offer }) => {
  console.log("peer:nego:needed", offer);
  io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
});

socket.on("peer:nego:done", ({ to, ans }) => {
  console.log("peer:nego:done", ans);
  io.to(to).emit("peer:nego:final", { from: socket.id, ans });
})

socket.on("call:ended", ({ to, from }) => {
  io.to(to).emit("call:ended");
  io.to(from).emit("call:ended"); 
});

});
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

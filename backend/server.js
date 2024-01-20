import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './Router/UserRoute.js';
import Adminrouter from './Router/adminRoute.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Mongo connected'))
  .catch(() => console.log('Not connected'));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use("/upload", express.static(path.join(__dirname, "/public/upload")));
app.use('/api/user', UserRouter);
app.use('/api/admin', Adminrouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

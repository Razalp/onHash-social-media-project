
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './Router/UserRoute.js'


dotenv.config();
const app = express();
const port = process.env.PORT
app.use(cors());
app.use(express.json());
mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("mongo connected"))
.catch(()=>console.log("not connected"));
  
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/user',UserRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000
const app = express();

app.use(cors());
app.use(express.json());
await connectDB();


app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

export default app;
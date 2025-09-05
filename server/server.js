import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000
const app = express();

// Configure CORS for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://imagi-frr9.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
await connectDB();


app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server for both local development and production (Render)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
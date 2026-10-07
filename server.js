import express from 'express';
let app = express();
import apiRouter from './routes/index.js';
import connectDB from './utils/db.js';
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors';
// Connect to MongoDB
connectDB();


app.use(express.json());
// Restrict CORS to your frontend domain in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:5173' 
    : 'http://localhost:5173',
  credentials: true,
}));
app.use('/', apiRouter);

app.use(errorHandler);

app.listen(3000);
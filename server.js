import express from 'express';
let app = express();
import apiRouter from './routes/index.js';
import connectDB from './utils/db.js';
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './utils/logger.js';


// Connect to MongoDB
connectDB();

// 3. Express app ko HTTP server mein wrap karein
const httpServer = createServer(app);

const FRONTEND_URL = process.env.CLIENT_URL;

app.use(express.json());
app.use(cookieParser());

// Restrict CORS to your frontend domain in production
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  maxAge: 86400
}));


// 4. Socket.IO instance initialize karein
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

// 5. Middleware: `io` ko har request object (`req.io`) mein attach karein
// Is se aap apne controllers mein `req.io.emit()` use kar sakenge!
app.use((req, res, next) => {
  req.io = io;
  next();
});


// 6. Socket.IO Connection Event Listener
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Disconnect listener
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});


app.use('/', apiRouter);

app.use(errorHandler);

httpServer.listen(3000, () => {
  logger.info('HTTP server listening on port 3000');
});
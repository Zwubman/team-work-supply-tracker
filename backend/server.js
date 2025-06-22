// server.js (ESM version)
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import db from './models/index.js'; 
import './utils/lowStockScheduler.js'; 

// Import routes
import userRouter from './routes/userRoute.js';
import itemRouter from './routes/itemRoute.js'; 
import movementRouter from './routes/movementRoute.js';
import supplyRouter from './routes/supplyRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
const allowedOrigins = ['https://team-work-supply-tracker.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/movements', movementRouter);
app.use('/api/supplies', supplyRouter)


// Start server and sync database
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully');

    await db.sequelize.sync({ alter: true }); 
    console.log('All models synced and tables created/updated');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

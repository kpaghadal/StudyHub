import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { initSocket } from './socket.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static uploads folder explicitly with forced download headers
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, filePath) => {
    const filename = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doubts', doubtRoutes); // Doubt questions and private chat routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

// Apply custom error handler middleware
app.use(errorHandler);

const server = http.createServer(app);

// Init Socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`StudyHub Backend API running on port ${PORT}`);
});

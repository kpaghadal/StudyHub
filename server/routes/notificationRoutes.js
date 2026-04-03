import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getUserNotifications);
router.patch('/read/:id', protect, markAsRead);

export default router;

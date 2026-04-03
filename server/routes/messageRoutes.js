import express from 'express';
import { getMessagesByGroup, createMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:groupId').get(protect, getMessagesByGroup);
router.route('/').post(protect, createMessage);

export default router;

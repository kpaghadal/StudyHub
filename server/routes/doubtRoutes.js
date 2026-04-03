import express from 'express';
import { getQuestions, createQuestion, getPrivateMessages, createPrivateMessage, getRecentChats } from '../controllers/doubtController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Questions
router.route('/questions')
  .get(protect, getQuestions)
  .post(protect, createQuestion);

// Recent Chats
router.route('/recent-chats')
  .get(protect, getRecentChats);

// Private Messages
router.route('/messages/:userId')
  .get(protect, getPrivateMessages);

router.route('/messages')
  .post(protect, createPrivateMessage);

export default router;

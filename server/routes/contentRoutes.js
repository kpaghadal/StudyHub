import express from 'express';
import { getContent, createContent, updateContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getContent).post(protect, createContent);
router.route('/:id').put(protect, updateContent);

export default router;

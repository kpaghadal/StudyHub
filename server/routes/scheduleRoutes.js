import express from 'express';
import { getSchedule, createSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSchedule).post(protect, createSchedule);
router.route('/:id').put(protect, updateSchedule).delete(protect, deleteSchedule);

export default router;

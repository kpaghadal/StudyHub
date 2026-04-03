import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent);

export default router;

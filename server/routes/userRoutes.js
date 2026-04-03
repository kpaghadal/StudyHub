import express from 'express';
import { getUserProfile, pinGroup, pinResource, likeResource } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.post('/:id/pin-group', protect, pinGroup);
router.post('/:id/pin-resource', protect, pinResource);
router.post('/:id/like-resource', protect, likeResource);

export default router;

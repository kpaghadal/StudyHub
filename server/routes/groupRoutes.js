import express from 'express';
import { getGroups, createGroup, updateGroup, deleteGroup, joinGroup } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGroups)
  .post(protect, createGroup);

router.route('/:id')
  .put(protect, updateGroup)
  .delete(protect, deleteGroup);

router.post('/:id/join', protect, joinGroup);

export default router;

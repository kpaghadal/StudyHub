import express from 'express';
import { getResources, createResource, updateResource, deleteResource } from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, upload.single('file'), createResource);

router.post('/upload', protect, upload.single('file'), createResource);

router.route('/:id')
  .put(protect, updateResource)
  .delete(protect, deleteResource);

export default router;

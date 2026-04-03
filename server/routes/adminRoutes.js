import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getResources,
  updateResource,
  deleteResource,
  getQuestions,
  deleteQuestion
} from '../controllers/adminController.js';

const router = express.Router();

// Apply protect and admin middleware to all routes in this file
router.use(protect, admin);

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Groups
router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Resources
router.get('/resources', getResources);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

// Questions (Doubts)
router.get('/questions', getQuestions);
router.delete('/questions/:id', deleteQuestion);

export default router;

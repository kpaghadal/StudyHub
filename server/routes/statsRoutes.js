import express from 'express';
import Group from '../models/Group.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/stats — Public platform stats
router.get('/', async (req, res) => {
  try {
    const [totalGroups, totalResources, totalUsers, totalMessages] = await Promise.all([
      Group.countDocuments(),
      Resource.countDocuments(),
      User.countDocuments(),
      Message.countDocuments(),
    ]);

    res.json({ totalGroups, totalResources, totalUsers, totalMessages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

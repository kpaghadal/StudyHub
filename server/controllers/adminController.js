import User from '../models/User.js';
import Group from '../models/Group.js';
import Resource from '../models/Resource.js';
import Question from '../models/Question.js';
import PrivateMessage from '../models/PrivateMessage.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalQuestions = await Question.countDocuments();
    
    // We don't have socket logic injected here for exact live users, 
    // but the frontend can pass it or we use a basic stat.
    
    // Example aggregation: Resources by type
    const resourcesByType = await Resource.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalGroups,
      totalResources,
      totalQuestions,
      resourcesByType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details/status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all groups
// @route   GET /api/admin/groups
// @access  Private/Admin
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({}).populate('creator', 'name email').sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new group (Admin Override)
// @route   POST /api/admin/groups
// @access  Private/Admin
export const createGroup = async (req, res) => {
  try {
    const { name, description, topic, semester } = req.body;
    const group = await Group.create({
      name,
      description,
      topic,
      semester,
      creator: req.user._id, // Created by the admin
      joined: true
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update group
// @route   PUT /api/admin/groups/:id
// @access  Private/Admin
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    group.name = req.body.name || group.name;
    group.description = req.body.description || group.description;
    group.topic = req.body.topic || group.topic;
    group.semester = req.body.semester || group.semester;
    
    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete group
// @route   DELETE /api/admin/groups/:id
// @access  Private/Admin
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    await Group.findByIdAndDelete(req.params.id);
    await Resource.deleteMany({ groupId: req.params.id });
    res.json({ message: 'Group and associated resources removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/admin/resources
// @access  Private/Admin
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resource info
// @route   PUT /api/admin/resources/:id
// @access  Private/Admin
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    resource.title = req.body.title || resource.title;
    resource.description = req.body.description || resource.description;
    resource.topic = req.body.topic || resource.topic;
    
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/admin/resources/:id
// @access  Private/Admin
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all questions
// @route   GET /api/admin/questions
// @access  Private/Admin
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/admin/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    
    await Question.findByIdAndDelete(req.params.id);
    await PrivateMessage.deleteMany({ questionId: req.params.id });
    res.json({ message: 'Question and associated Private Messages removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

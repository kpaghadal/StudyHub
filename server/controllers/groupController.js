import Group from '../models/Group.js';
import Resource from '../models/Resource.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'name email').sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { creator, ...rest } = req.body;
    const creatorId = creator || req.user._id;
    
    const newGroup = new Group({
      ...rest,
      creator: creatorId,
      members: creatorId ? [creatorId] : [req.user._id]
    });
    const savedGroup = await newGroup.save();

    // Create notifications for all other users
    try {
      const creatorUser = await User.findById(creatorId);
      const allUsers = await User.find({ _id: { $ne: creatorId } });
      
      const notifications = allUsers.map(user => ({
        userId: user._id,
        type: 'group_created',
        title: 'New Group Created',
        message: `New group '${savedGroup.name || savedGroup.title}' created by ${creatorUser?.name || 'a user'}`,
        groupId: savedGroup._id
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        
        // Emit via Socket.io
        try {
          const io = getIO();
          io.emit('new_notification', {
            type: 'group_created',
            title: 'New Group Created',
            message: `New group '${savedGroup.name || savedGroup.title}' created by ${creatorUser?.name || 'a user'}`,
            groupId: savedGroup._id
          });
        } catch (socketErr) {
          console.error('Socket emission failed:', socketErr);
        }
      }
    } catch (notifErr) {
      console.error('Notification creation failed:', notifErr);
    }

    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }
    
    if (group.creator && group.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this group' });
    }

    await Group.findByIdAndDelete(req.params.id);
    await Resource.deleteMany({ groupId: req.params.id });
    await Message.deleteMany({ groupId: req.params.id });
    res.json({ message: 'Group and related data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (!group.members) group.members = [];

    const memberExists = group.members.some(m => m.toString() === userId.toString());
    
    if (!memberExists) {
      group.members.push(userId);
      await group.save();
    }
    
    const populatedGroup = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(populatedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Group from './models/Group.js';
import Resource from './models/Resource.js';
import Message from './models/Message.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyhub';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- AUTH ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'studyhub_secret_key', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- GROUPS ---
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'name email').sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const { creator, ...rest } = req.body;
    const newGroup = new Group({
      ...rest,
      creator,
      members: creator ? [creator] : []
    });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/groups/:id', async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    await Resource.deleteMany({ groupId: req.params.id });
    await Message.deleteMany({ groupId: req.params.id });
    res.json({ message: 'Group related data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- RESOURCES ---
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST resource — supports both JSON (link/video) and multipart (file upload)
app.post('/api/resources', upload.single('file'), async (req, res) => {
  try {
    const body = req.body;
    const resourceData = {
      title: body.title,
      type: body.type || 'PDF',
      author: body.author || 'Scholar',
      authorId: body.authorId,
      groupId: body.groupId,
      description: body.description || '',
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : JSON.parse(body.tags)) : [],
      url: body.url || '',
    };
    if (req.file) {
      resourceData.fileUrl = `/uploads/${req.file.filename}`;
      resourceData.fileName = req.file.originalname;
    }
    const newResource = new Resource(resourceData);
    const saved = await newResource.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/resources/:id', async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- MESSAGES ---
app.get('/api/messages/:groupId', async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- USER INTERACTIONS ---
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/groups/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    // Legacy support for mock data:
    if (!group.members) group.members = [];

    // Mongoose array includes check:
    const memberExists = group.members.some(m => m.toString() === userId.toString());
    
    if (!memberExists) {
      group.members.push(userId);
      await group.save();
    }
    // Repopulate to get names
    const populatedGroup = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(populatedGroup);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.post('/api/users/:id/pin-group', async (req, res) => {
  try {
    const { groupId } = req.body;
    const user = await User.findById(req.params.id);
    const index = user.pinnedGroups.indexOf(groupId);
    if (index === -1) user.pinnedGroups.push(groupId);
    else user.pinnedGroups.splice(index, 1);
    await user.save();
    res.json(user.pinnedGroups);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.post('/api/users/:id/pin-resource', async (req, res) => {
  try {
    const { resourceId } = req.body;
    const user = await User.findById(req.params.id);
    const index = user.pinnedResources.indexOf(resourceId);
    if (index === -1) user.pinnedResources.push(resourceId);
    else user.pinnedResources.splice(index, 1);
    await user.save();
    res.json(user.pinnedResources);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.post('/api/users/:id/like-resource', async (req, res) => {
  try {
    const { resourceId } = req.body;
    const user = await User.findById(req.params.id);
    const resource = await Resource.findById(resourceId);
    
    if (!user || !resource) return res.status(404).json({ message: 'Not found' });

    const index = user.likedResources.indexOf(resourceId);
    if (index === -1) {
      user.likedResources.push(resourceId);
      resource.likes = (resource.likes || 0) + 1;
    } else {
      user.likedResources.splice(index, 1);
      resource.likes = Math.max(0, (resource.likes || 1) - 1);
    }
    
    await user.save();
    await resource.save();
    
    res.json({ likedResources: user.likedResources, likes: resource.likes });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`StudyHub Backend API running on port ${PORT}`);
});

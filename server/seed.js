import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Group from './models/Group.js';
import Resource from './models/Resource.js';
import Message from './models/Message.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyhub';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected. Clearing database...');

    await Group.deleteMany();
    await Resource.deleteMany();
    await Message.deleteMany();

    console.log('Seeding Data...');

    const g1 = await new Group({
      name: "Data Structures & Algorithms", topic: "Computer Science", semester: "Semester 3",
      description: "A group dedicated to mastering DSA with weekly mock interviews.", members: 124,
      tags: ["DSA", "LeetCode", "Java"], pinned: true
    }).save();

    const g2 = await new Group({
      name: "Calculus III Study Group", topic: "Mathematics", semester: "Semester 2",
      description: "Sharing notes, past papers, and video lectures for advanced calculus.", members: 89,
      tags: ["Math", "Calculus", "Derivatives"], pinned: false
    }).save();

    const g3 = await new Group({
      name: "Web Development Bootcamp", topic: "Software Engineering", semester: "Semester 4",
      description: "Learn full-stack web development. React, Node.js, and MongoDB resources.", members: 256,
      tags: ["React", "JavaScript", "Frontend"], pinned: true
    }).save();

    const g4 = await new Group({
      name: "Physics 101 Labs", topic: "Physics", semester: "Semester 1",
      description: "Group for sharing lab experiment data and write-up templates.", members: 45,
      tags: ["Physics", "Mechanics", "Lab"], pinned: false
    }).save();

    const g5 = await new Group({
      name: "Machine Learning Fundamentals", topic: "Computer Science", semester: "Semester 6",
      description: "Covering supervised, unsupervised learning and neural networks from scratch.", members: 178,
      tags: ["ML", "Python", "TensorFlow"], pinned: false
    }).save();

    // Resources
    await new Resource({
      title: "Graph Algorithms Cheatsheet", type: "PDF", author: "Alex Johnson",
      groupId: g1._id, description: "A comprehensive reference for BFS, DFS, Dijkstra.",
      tags: ["Graphs", "DSA"], pinned: true, likes: 45
    }).save();

    await new Resource({
      title: "Dynamic Programming Top 50 Patterns", type: "Video", author: "Maria Garcia",
      groupId: g1._id, description: "Video series covering DP patterns.",
      tags: ["DP", "LeetCode"], pinned: false, likes: 120
    }).save();

    await new Resource({
      title: "React Router v6 Complete Guide", type: "Link", author: "Sam Smith",
      groupId: g3._id, description: "Official docs + examples for React Router 6.",
      tags: ["React", "Routing"], pinned: false, likes: 32
    }).save();

    await new Resource({
      title: "Neural Networks from Scratch", type: "Video", author: "David Lee",
      groupId: g5._id, description: "Build a neural network using only NumPy.",
      tags: ["ML", "Neural Nets"], pinned: true, likes: 89
    }).save();

    await new Resource({
      title: "Tailwind CSS Cheatsheet", type: "PDF", author: "Elena M.",
      groupId: g3._id, description: "Quick reference for all Tailwind utility classes.",
      tags: ["CSS", "Frontend"], pinned: false, likes: 55
    }).save();

    // Messages
    await new Message({
      text: "Hey everyone! Has anyone started on the weekly problems yet?", author: "Alex Johnson", avatar: "AJ", groupId: g1._id,
    }).save();

    await new Message({
      text: "Yes, I managed to solve the first two graph problems.", author: "Maria Garcia", avatar: "MG", groupId: g1._id,
    }).save();

    await new Message({
      text: "Has anyone tried the new React Router v6 hooks?", author: "Sam Smith", avatar: "SS", groupId: g3._id,
    }).save();

    await new Message({
      text: "Yes! useNavigate is so much cleaner than the old history API.", author: "You", avatar: "YO", groupId: g3._id,
    }).save();

    console.log('Seeding Complete!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

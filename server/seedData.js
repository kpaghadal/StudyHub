import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import Schedule from './models/Schedule.js';
import Content from './models/Content.js';

dotenv.config();

const events = [
  { title: 'Mock Interview Marathon', group: 'Data Structures & Algorithms', date: new Date('2026-03-29'), time: '10:00 AM', location: 'Online - Google Meet', attendees: 34, color: '#6366f1', emoji: '🎯' },
  { title: 'React Workshop: Hooks Deep Dive', group: 'Web Development Bootcamp', date: new Date('2026-03-31'), time: '2:00 PM', location: 'Room B-204', attendees: 22, color: '#10b981', emoji: '⚛️' },
  { title: 'Calculus Problem-Solving Session', group: 'Calculus III Study Group', date: new Date('2026-04-01'), time: '4:00 PM', location: 'Library Hall 1', attendees: 15, color: '#f59e0b', emoji: '📐' },
  { title: 'ML Paper Reading Club', group: 'Machine Learning Fundamentals', date: new Date('2026-04-03'), time: '6:00 PM', location: 'Online - Discord', attendees: 28, color: '#8b5cf6', emoji: '🤖' },
  { title: 'Physics Lab Review', group: 'Physics 101 Labs', date: new Date('2026-04-05'), time: '11:00 AM', location: 'Lab 3-A', attendees: 12, color: '#ef4444', emoji: '⚗️' },
];

const schedule = [
  { day: 'Monday', time: '10:00 AM', title: 'DSA Problem Set Review', group: 'Data Structures & Algorithms', duration: '90 min', color: '#6366f1' },
  { day: 'Tuesday', time: '3:00 PM', title: 'React Hooks Workshop', group: 'Web Development Bootcamp', duration: '60 min', color: '#10b981' },
  { day: 'Wednesday', time: '5:00 PM', title: 'Calculus Mock Exam Prep', group: 'Calculus III Study Group', duration: '120 min', color: '#f59e0b' },
  { day: 'Thursday', time: '11:00 AM', title: 'ML Paper Discussion', group: 'Machine Learning Fundamentals', duration: '45 min', color: '#8b5cf6' },
  { day: 'Friday', time: '2:00 PM', title: 'Full Stack Project Review', group: 'Web Development Bootcamp', duration: '90 min', color: '#10b981' },
];

const content = [
  { page: 'features', section: 'feature1', title: 'Dedicated Study Groups', body: 'Create groups specific to a subject and semester. Isolate your focus and learn together with your class.', extra: { icon: 'Users', color: 'text-primary' } },
  { page: 'features', section: 'feature2', title: 'Resource Sharing Hub', body: 'Upload PDFs, links, and video resources. Categorize them and let the group download or view them instantly.', extra: { icon: 'Share2', color: 'text-secondary' } },
  { page: 'features', section: 'feature3', title: 'Real-time Group Chat', body: 'Built-in messaging allows you to ask questions, plan study sessions, and communicate directly in the group.', extra: { icon: 'MessageSquare', color: 'text-accent' } },
  { page: 'features', section: 'feature4', title: 'Smart Discovery', body: 'Use smart filters by topic and semester to find existing groups instead of creating redundant ones.', extra: { icon: 'Search', color: 'text-primary' } },
  { page: 'about', section: 'mission', title: 'Our Mission', body: 'StudyHub was created during a hackathon to solve a common problem: fragmented communication and resource loss across different student chat groups and portals. We believe that collaborative learning should be seamless, organized, and accessible to everyone. Our platform aims to centralize study groups so that every resource shared is preserved for the entire semester.', extra: {} },
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyhub';
    await mongoose.connect(MONGO_URI);
    
    console.log('MongoDB connected for seeding...');
    
    await Event.deleteMany({});
    await Schedule.deleteMany({});
    await Content.deleteMany({});
    
    await Event.insertMany(events);
    await Schedule.insertMany(schedule);
    await Content.insertMany(content);
    
    console.log('Database seeded with static data successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

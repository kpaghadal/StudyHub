import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyhub';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connection established successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;

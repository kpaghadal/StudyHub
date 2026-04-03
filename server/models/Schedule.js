import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  group: { type: String, required: true },
  duration: { type: String, required: true },
  color: { type: String, default: '#6366f1' }
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  group: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  attendees: { type: Number, default: 0 },
  color: { type: String, default: '#6366f1' },
  emoji: { type: String, default: '📅' }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);

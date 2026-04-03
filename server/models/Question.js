import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  repliesCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);

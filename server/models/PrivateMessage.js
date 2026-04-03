import mongoose from 'mongoose';

const privateMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('PrivateMessage', privateMessageSchema);

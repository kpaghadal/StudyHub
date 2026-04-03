import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'User' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  avatar: { type: String, default: 'US' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);

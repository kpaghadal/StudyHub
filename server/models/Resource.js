import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  publicId: { type: String }
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Video', 'Link', 'Notes', 'Document', 'ZIP', 'Image'], default: 'PDF' },
  author: { type: String, default: 'User' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  url: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  attachments: [attachmentSchema],
  // Legacy support fields:
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);

import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: { type: String, required: true },
  section: { type: String, required: true },
  title: { type: String },
  body: { type: String },
  extra: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);

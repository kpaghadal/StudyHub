import Content from '../models/Content.js';

export const getContent = async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createContent = async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const saved = await newContent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

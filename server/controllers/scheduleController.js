import Schedule from '../models/Schedule.js';

export const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const saved = await newSchedule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

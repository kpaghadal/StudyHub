import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications/:userId
// @access  Private
export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/read/:id
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

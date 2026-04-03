import Message from '../models/Message.js';
import Group from '../models/Group.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

export const getMessagesByGroup = async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      ...req.body,
      authorId: req.user._id,
      author: req.body.author || req.user.name
    });
    const savedMessage = await newMessage.save();

    // Trigger Notifications for Group Members
    if (req.body.groupId) {
      try {
        const group = await Group.findById(req.body.groupId);
        if (group && group.members) {
          const authorIdString = req.user._id.toString();
          const membersToNotify = group.members.filter(mId => mId.toString() !== authorIdString);
          
          if (membersToNotify.length > 0) {
            const authorName = req.body.author || req.user.name || 'A user';
            const groupName = group.name || group.title || 'the group';

            const notifications = membersToNotify.map(mId => ({
              userId: mId,
              type: 'message_added',
              title: 'New Message in Group',
              message: `New message added in '${groupName}' by ${authorName}`,
              groupId: group._id
            }));
            
            await Notification.insertMany(notifications);
            
            try {
              const io = getIO();
              io.emit('new_notification', {
                type: 'message_added',
                title: 'New Message in Group',
                message: `New message added in '${groupName}' by ${authorName}`,
                groupId: group._id,
                notifyUsers: membersToNotify.map(m => m.toString())
              });
            } catch (ioErr) {
              console.error('Socket error on message notification:', ioErr);
            }
          }
        }
      } catch (notifErr) {
        console.error('Error creating message notifications:', notifErr);
      }
    }

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

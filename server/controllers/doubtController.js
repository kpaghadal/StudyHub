import Question from '../models/Question.js';
import PrivateMessage from '../models/PrivateMessage.js';
import User from '../models/User.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('userId', 'name role username status') // assuming 'status' might hold online status
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question({
      userId: req.user._id,
      text: req.body.text
    });
    const saved = await newQuestion.save();
    const populated = await Question.findById(saved._id).populate('userId', 'name role username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The other user in the chat
    const currentUserId = req.user._id;

    const messages = await PrivateMessage.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name username')
    .sort({ createdAt: 1 }); // Oldest first for chat history

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPrivateMessage = async (req, res) => {
  try {
    const { receiverId, text, questionId } = req.body;
    
    // Create the message
    const newMessage = new PrivateMessage({
      senderId: req.user._id,
      receiverId,
      text,
      questionId
    });
    const saved = await newMessage.save();
    
    // Update reply count if replying to a question
    if (questionId) {
      await Question.findByIdAndUpdate(questionId, { $inc: { repliesCount: 1 } });
    }

    const populated = await PrivateMessage.findById(saved._id)
      .populate('senderId', 'name username')
      .populate('receiverId', 'name username');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch all messages involving the user, sorted by newest first
    const messages = await PrivateMessage.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name username')
    .populate('receiverId', 'name username');

    // Filter to get unique active chat users
    const uniqueUsersMap = new Map();
    
    for (const msg of messages) {
       if (!msg.senderId || !msg.receiverId) continue;
       
       const isSender = msg.senderId._id.toString() === currentUserId.toString();
       const otherUser = isSender ? msg.receiverId : msg.senderId;
       
       if (!otherUser) continue;
       
       const otherId = otherUser._id.toString();
       if (!uniqueUsersMap.has(otherId)) {
          uniqueUsersMap.set(otherId, {
             _id: otherUser._id,
             name: otherUser.name,
             username: otherUser.username,
             lastMessage: msg.text,
             lastMessageTime: msg.createdAt
          });
       }
    }
    
    const recentChats = Array.from(uniqueUsersMap.values());
    res.json(recentChats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

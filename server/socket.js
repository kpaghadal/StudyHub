import { Server } from 'socket.io';
import User from './models/User.js';

let io;
// Map to track active users. Key: userId (string), Value: { socketId, user: { _id, name, username ... } }
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For dev, you might want to restrict this in production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Update online user status
    socket.on('user_connected', async (userId) => {
      if (!userId) return;
      
      try {
        const user = await User.findById(userId).select('_id name username');
        if (user) {
          onlineUsers.set(userId, { socketId: socket.id, user });
          console.log(`User registered: ${userId} with socket ${socket.id}`);
          
          // Broadcast the list of online user objects
          const activeUsers = Array.from(onlineUsers.values()).map(val => val.user);
          io.emit('online_users_updated', activeUsers);
        }
      } catch (err) {
        console.error('Socket user connect error', err);
      }
    });

    // Handle new doubt/question posted
    socket.on('send_question', (questionData) => {
      // broadcast to everyone except sender
      socket.broadcast.emit('receive_question', questionData);
    });

    // Handle private reply sent
    socket.on('send_reply', (replyData) => {
      const { receiverId } = replyData;
      const receiverEntry = onlineUsers.get(receiverId?.toString());
      
      if (receiverEntry) {
        // user is online, emit exact message to their socket
        io.to(receiverEntry.socketId).emit('receive_reply', replyData);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // find which user has this socket id and remove them
      let disconnectedUserId = null;
      for (let [userId, val] of onlineUsers.entries()) {
        if (val.socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }
      
      if (disconnectedUserId) {
        // Broadcast the updated online users list
        const activeUsers = Array.from(onlineUsers.values()).map(val => val.user);
        io.emit('online_users_updated', activeUsers);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

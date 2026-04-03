import Resource from '../models/Resource.js';
import Group from '../models/Group.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../socket.js';
import fs from 'fs';
import path from 'path';

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const body = req.body;
    let resourceData = {
      title: body.title,
      type: body.type || 'PDF',
      author: body.author || 'Scholar',
      authorId: body.authorId || req.user._id,
      groupId: body.groupId,
      description: body.description || '',
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : JSON.parse(body.tags)) : [],
      url: body.url || '',
      attachments: []
    };
    
    // Process file from multer
    if (req.file) {
      resourceData.attachments.push({
        fileUrl: `uploads/${req.file.filename}`, 
        fileName: req.file.originalname,
        fileSize: req.file.size, 
        fileType: req.file.mimetype,
        publicId: req.file.filename // store just filename
      });
      // Fallback for flat schema field (so it correctly adds to the DB flatly)
      resourceData.fileUrl = `uploads/${req.file.filename}`;
      resourceData.fileName = req.file.originalname;
    }
    
    const newResource = new Resource(resourceData);
    const saved = await newResource.save();

    // Notification Logic for Group Members
    if (resourceData.groupId) {
      try {
        const group = await Group.findById(resourceData.groupId);
        if (group && group.members) {
          const authorIdString = resourceData.authorId.toString();
          const membersToNotify = group.members.filter(mId => mId.toString() !== authorIdString);
          
          if (membersToNotify.length > 0) {
            const authorName = resourceData.author || 'a user';
            const groupName = group.name || group.title || 'the group';

            const notifications = membersToNotify.map(mId => ({
              userId: mId,
              type: 'resource_added',
              title: 'New Resource Added',
              message: `New resource added in '${groupName}' by ${authorName}`,
              groupId: group._id,
              resourceId: saved._id
            }));
            
            await Notification.insertMany(notifications);
            
            try {
              const io = getIO();
              io.emit('new_notification', {
                type: 'resource_added',
                title: 'New Resource Added',
                message: `New resource added in '${groupName}' by ${authorName}`,
                groupId: group._id,
                resourceId: saved._id,
                notifyUsers: membersToNotify.map(m => m.toString())
              });
            } catch (ioErr) {
              console.error('Socket error on resource creation:', ioErr);
            }
          }
        }
      } catch (err) {
        console.error('Error creating resource notifications:', err);
      }
    }
    
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    
    if (resource.authorId && resource.authorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this resource' });
    }

    // Attempt to delete local attached files
    if (resource.attachments && resource.attachments.length > 0) {
      for (const attachment of resource.attachments) {
        if (attachment.publicId || attachment.fileUrl) {
           const filename = attachment.publicId || (attachment.fileUrl && attachment.fileUrl.split('/').pop());
           if (filename) {
             const filePath = path.join(process.cwd(), 'uploads', filename);
             if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath);
             }
           }
        }
      }
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

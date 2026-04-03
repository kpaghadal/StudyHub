import User from '../models/User.js';
import Resource from '../models/Resource.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const pinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const user = await User.findById(req.params.id);
    const index = user.pinnedGroups.indexOf(groupId);
    
    if (index === -1) {
        user.pinnedGroups.push(groupId);
    } else {
        user.pinnedGroups.splice(index, 1);
    }
    
    await user.save();
    res.json(user.pinnedGroups);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const pinResource = async (req, res) => {
  try {
    const { resourceId } = req.body;
    const user = await User.findById(req.params.id);
    const index = user.pinnedResources.indexOf(resourceId);
    
    if (index === -1) {
        user.pinnedResources.push(resourceId);
    } else {
        user.pinnedResources.splice(index, 1);
    }
    
    await user.save();
    res.json(user.pinnedResources);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const likeResource = async (req, res) => {
  try {
    const { resourceId } = req.body;
    const user = await User.findById(req.params.id);
    const resource = await Resource.findById(resourceId);
    
    if (!user || !resource) {
        return res.status(404).json({ message: 'Not found' });
    }

    const index = user.likedResources.indexOf(resourceId);
    
    if (index === -1) {
      user.likedResources.push(resourceId);
      resource.likes = (resource.likes || 0) + 1;
    } else {
      user.likedResources.splice(index, 1);
      resource.likes = Math.max(0, (resource.likes || 1) - 1);
    }
    
    await user.save();
    await resource.save();
    
    res.json({ likedResources: user.likedResources, likes: resource.likes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';

let nextId = 1000;
const genId = () => (++nextId).toString();

const initialState = {
  groups: [],
  resources: [],
  messages: [],
  toasts: [],
  notifications: [],
};

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('studyhub_token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}${endpoint}`, { ...options, headers });
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, groups: action.payload.groups, resources: action.payload.resources, messages: action.payload.messages, notifications: action.payload.notifications || [] };
    
    // ── Notifications ──
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      if (state.notifications.some(n => n._id === action.payload._id || (n.groupId === action.payload.groupId && n.type === action.payload.type && n.message === action.payload.message))) {
        return state;
      }
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n._id === action.payload ? { ...n, isRead: true } : n
        )
      };
    
    // ── Groups ──
    case 'ADD_GROUP':
      return { ...state, groups: [action.payload, ...state.groups] };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g),
      };
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.payload),
        resources: state.resources.filter(r => r.groupId !== action.payload),
        messages: state.messages.filter(m => m.groupId !== action.payload),
      };
    case 'TOGGLE_PIN_GROUP':
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload.id ? { ...g, pinned: action.payload.pinned } : g),
      };

    // ── Resources ──
    case 'ADD_RESOURCE':
      return { ...state, resources: [action.payload, ...state.resources] };
    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resources: state.resources.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r),
      };
    case 'DELETE_RESOURCE':
      return { ...state, resources: state.resources.filter(r => r.id !== action.payload) };
    case 'UPDATE_RESOURCE_LIKE':
      return {
        ...state,
        resources: state.resources.map(r =>
          r.id === action.payload.id
            ? { ...r, likedByUser: action.payload.likedByUser, likes: action.payload.likes }
            : r
        ),
      };
    case 'UPDATE_RESOURCE_PIN':
      return {
        ...state,
        resources: state.resources.map(r =>
          r.id === action.payload.id ? { ...r, pinned: action.payload.pinned } : r
        ),
      };

    // ── Messages ──
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    // ── Toasts ──
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    default:
      return state;
  }
}

const mapDoc = (doc, userProfile) => {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  const idStr = _id.toString();
  
  if (userProfile && rest.topic) {
    rest.pinned = userProfile.pinnedGroups?.includes(idStr);
    rest.joined = Array.isArray(rest.members) 
      ? rest.members.some(m => (m._id || m).toString() === userProfile._id.toString()) 
      : false;
  } else if (userProfile && rest.title) {
    rest.pinned = userProfile.pinnedResources?.includes(idStr);
    rest.likedByUser = userProfile.likedResources?.includes(idStr);
  }
  
  if (rest.members !== undefined) {
    rest.memberCount = Array.isArray(rest.members) ? rest.members.length : (typeof rest.members === 'number' ? rest.members : 0);
  } else {
    rest.memberCount = 0;
  }
  
  return { ...rest, id: idStr };
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const token = localStorage.getItem('studyhub_token');
      let userProfile = null;

      if (token) {
        const verifyRes = await apiFetch('/auth/verify');
        if (verifyRes.ok) {
          userProfile = await verifyRes.json();
          // Keep localStorage sync'd just in case, though the token is what matters most
          localStorage.setItem('studyhub_user', JSON.stringify(userProfile));
          setCurrentUser(userProfile);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('studyhub_token');
          localStorage.removeItem('studyhub_user');
          setCurrentUser(null);
          window.location.href = '/login';
          return; // Stop execution
        }
      } else {
         setCurrentUser(null);
      }

      setIsVerifying(false);

      // Fetch notifications if user is logged in
      let notifData = [];
      if (userProfile) {
        try {
          const notifRes = await apiFetch(`/notifications/${userProfile._id}`);
          if (notifRes.ok) notifData = await notifRes.json();
        } catch (e) {
          console.error('Failed to fetch notifications', e);
        }
      }

      const [grpRes, resRes] = await Promise.all([
        apiFetch(`/groups`),
        apiFetch(`/resources`)
      ]);

      const grpData = await grpRes.json();
      const resData = await resRes.json();

      dispatch({ type: 'SET_DATA', payload: {
        groups: Array.isArray(grpData) ? grpData.map(g => mapDoc(g, userProfile)) : [],
        resources: Array.isArray(resData) ? resData.map(r => mapDoc(r, userProfile)) : [],
        messages: [],
        notifications: Array.isArray(notifData) ? notifData : []
      }});
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = useCallback((message, type = 'success') => {
    const id = genId();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  const addGroup = useCallback(async (data) => {
    try {
      const payload = { ...data, creator: currentUser?._id };
      const res = await apiFetch(`/groups`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Failed to create group');

      const group = mapDoc(resData, currentUser);
      dispatch({ type: 'ADD_GROUP', payload: group });
      showToast(`Group "${group.name}" created!`);
      return group.id;
    } catch (err) { 
      showToast(err.message, "error"); 
    }
  }, [showToast, currentUser]);

  const joinGroup = useCallback(async (id) => {
    if(!currentUser) return showToast("Please log in first", "error");
    try {
      const res = await apiFetch(`/groups/${id}/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      if (res.ok) {
        const updated = await res.json();
        const mapped = mapDoc(updated, currentUser);
        dispatch({ type: 'UPDATE_GROUP', payload: mapped });
        showToast("Joined group!");
      }
    } catch (err) { }
  }, [currentUser, showToast]);

  const updateGroup = useCallback(async (data) => {
    try {
      const res = await apiFetch(`/groups/${data.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update group');
      dispatch({ type: 'UPDATE_GROUP', payload: mapDoc(await res.json(), currentUser) });
      showToast('Group updated successfully.');
    } catch (err) { showToast(err.message, "error"); }
  }, [showToast, currentUser]);

  const deleteGroup = useCallback(async (id, name) => {
    try {
      const res = await apiFetch(`/groups/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete group (Unauth?)');
      dispatch({ type: 'DELETE_GROUP', payload: id });
      showToast(`Group "${name}" deleted.`, 'error');
    } catch (err) { showToast(err.message, "error"); }
  }, [showToast]);

  const togglePinGroup = useCallback(async (id) => {
    if(!currentUser) return;
    try {
      const res = await apiFetch(`/users/${currentUser._id}/pin-group`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: id })
      });
      if (res.ok) {
        const pinnedGroups = await res.json();
        setCurrentUser(prev => ({...prev, pinnedGroups}));
        dispatch({ type: 'TOGGLE_PIN_GROUP', payload: { id, pinned: pinnedGroups.includes(id) } });
      }
    } catch (e) { }
  }, [currentUser]);

  const addResource = useCallback(async (data) => {
    try {
      let res;
      if (data.file) {
        const fd = new FormData();
        fd.append('file', data.file);
        fd.append('title', data.title);
        fd.append('type', data.type);
        fd.append('author', currentUser?.name || 'Scholar');
        fd.append('authorId', currentUser?._id || '');
        fd.append('groupId', data.groupId);
        fd.append('description', data.description || '');
        fd.append('tags', JSON.stringify(data.tags || []));
        res = await apiFetch(`/resources`, { method: 'POST', body: fd });
      } else {
        const payload = { ...data, author: currentUser?.name || 'Scholar', authorId: currentUser?._id };
        res = await apiFetch(`/resources`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error('Failed to add resource');
      dispatch({ type: 'ADD_RESOURCE', payload: mapDoc(await res.json(), currentUser) });
      showToast('Resource shared successfully!');
    } catch (err) { showToast(err.message, "error"); }
  }, [showToast, currentUser]);

  const updateResource = useCallback(async (data) => {
    try {
      const { id, ...rest } = data;
      const res = await apiFetch(`/resources/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
      });
      if (!res.ok) throw new Error('Failed to update resource');
      dispatch({ type: 'UPDATE_RESOURCE', payload: mapDoc(await res.json(), currentUser) });
      showToast('Resource updated.');
    } catch (err) { showToast(err.message, "error"); }
  }, [showToast, currentUser]);

  const deleteResource = useCallback(async (id) => {
    try {
      const res = await apiFetch(`/resources/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete resource');
      dispatch({ type: 'DELETE_RESOURCE', payload: id });
      showToast('Resource removed.', 'error');
    } catch (err) { showToast(err.message, "error"); }
  }, [showToast]);

  const toggleLike = useCallback(async (id) => {
    if(!currentUser) return;
    try {
      const res = await apiFetch(`/users/${currentUser._id}/like-resource`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(prev => ({...prev, likedResources: data.likedResources}));
        dispatch({ type: 'UPDATE_RESOURCE_LIKE', payload: { id, likedByUser: data.likedResources.includes(id), likes: data.likes } });
      }
    } catch (e) { }
  }, [currentUser]);

  const togglePinResource = useCallback(async (id) => {
    if(!currentUser) return;
    try {
      const res = await apiFetch(`/users/${currentUser._id}/pin-resource`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id })
      });
      if(res.ok) {
        const pinnedResources = await res.json();
        setCurrentUser(prev => ({...prev, pinnedResources}));
        dispatch({ type: 'UPDATE_RESOURCE_PIN', payload: { id, pinned: pinnedResources.includes(id) } });
      }
    } catch (e) { }
  }, [currentUser]);

  const sendMessage = useCallback(async (groupId, text) => {
    const msg = {
      id: genId(), groupId, sender: currentUser?.name || 'Scholar', avatar: (currentUser?.name || 'S').substring(0,2).toUpperCase(),
      text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true, isSystem: false, authorId: currentUser?._id
    };
    dispatch({ type: 'ADD_MESSAGE', payload: msg });

    try {
       await apiFetch(`/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, text, author: currentUser?.name || 'Scholar', authorId: currentUser?._id, avatar: msg.avatar })
      });
    } catch (e) {}
  }, [currentUser]);

  const fetchMessagesForGroup = useCallback(async (groupId) => {
     try {
       const res = await apiFetch(`/messages/${groupId}`);
       const result = await res.json();
       if(Array.isArray(result) && result.length > 0) {
          const mapped = result.map(m => mapDoc({
             ...m,
             sender: m.author,
             timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             isCurrentUser: m.authorId ? m.authorId === currentUser?._id : m.author === (currentUser?.name || 'Scholar')
          }, currentUser));
          dispatch({ type: 'SET_DATA', payload: { ...state, messages: [...state.messages.filter(m => m.groupId !== groupId), ...mapped] }})
       }
     } catch (e) {}
  }, [state, currentUser]);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const markNotificationAsRead = useCallback(async (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    try {
      await apiFetch(`/notifications/read/${id}`, { method: 'PATCH' });
    } catch (e) {}
  }, []);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const logout = useCallback(() => {
    localStorage.removeItem('studyhub_token');
    localStorage.removeItem('studyhub_user');
    setCurrentUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setOnlineUsers([]);
    dispatch({ type: 'SET_DATA', payload: { groups: [], resources: [], messages: [], notifications: [] } });
  }, [socket]);


  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        newSocket.emit('user_connected', currentUser._id);
      });

      newSocket.on('online_users_updated', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('new_notification', (notif) => {
        // Check if the notification is meant for this user
        if (notif.type === 'resource_added' || notif.type === 'message_added') {
           if (!notif.notifyUsers || !notif.notifyUsers.includes(currentUser._id.toString())) {
             return; // Ignore if not meant for this user
           }
        }
        
        const newNotif = {
           _id: Math.random().toString(36).substr(2, 9), // Local ID until refreshed
           ...notif,
           isRead: false,
           createdAt: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotif });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [currentUser]);  

  const value = {
    ...state,
    currentUser,
    setCurrentUser,
    isVerifying,
    socket,
    onlineUsers,
    notifications: state.notifications || [],
    addGroup, joinGroup, updateGroup, deleteGroup, togglePinGroup,
    addResource, updateResource, deleteResource, toggleLike, togglePinResource,
    sendMessage, showToast, removeToast, fetchMessagesForGroup, refreshData, logout,
    markNotificationAsRead,
    topics: ["Computer Science", "Mathematics", "Physics", "Software Engineering", "Engineering", "Business"],
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

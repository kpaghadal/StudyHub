import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const initialGroups = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    topic: "Computer Science",
    semester: "Semester 3",
    description: "A group dedicated to mastering DSA with weekly mock interviews and problem-solving sessions.",
    members: 124,
    tags: ["DSA", "LeetCode", "Java"],
    recentActivity: "2025-03-27T13:00:00Z",
    pinned: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Calculus III Study Group",
    topic: "Mathematics",
    semester: "Semester 2",
    description: "Sharing notes, past papers, and video lectures for advanced calculus.",
    members: 89,
    tags: ["Math", "Calculus", "Derivatives"],
    recentActivity: "2025-03-26T09:00:00Z",
    pinned: false,
    createdAt: "2025-02-01T10:00:00Z",
  },
  {
    id: 3,
    name: "Web Development Bootcamp",
    topic: "Software Engineering",
    semester: "Semester 4",
    description: "Learn full-stack web development. React, Node.js, and MongoDB resources.",
    members: 256,
    tags: ["React", "JavaScript", "Frontend"],
    recentActivity: "2025-03-27T14:55:00Z",
    pinned: true,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: 4,
    name: "Physics 101 Labs",
    topic: "Physics",
    semester: "Semester 1",
    description: "Group for sharing lab experiment data and write-up templates.",
    members: 45,
    tags: ["Physics", "Mechanics", "Lab"],
    recentActivity: "2025-03-24T08:00:00Z",
    pinned: false,
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: 5,
    name: "Machine Learning Fundamentals",
    topic: "Computer Science",
    semester: "Semester 6",
    description: "Covering supervised, unsupervised learning and neural networks from scratch.",
    members: 178,
    tags: ["ML", "Python", "TensorFlow"],
    recentActivity: "2025-03-27T11:30:00Z",
    pinned: false,
    createdAt: "2025-02-15T10:00:00Z",
  },
  {
    id: 6,
    name: "Business Strategy & Case Studies",
    topic: "Business",
    semester: "Semester 5",
    description: "Analyzing real-world business cases and management strategy frameworks.",
    members: 62,
    tags: ["MBA", "Strategy", "Case Study"],
    recentActivity: "2025-03-25T16:00:00Z",
    pinned: false,
    createdAt: "2025-02-20T10:00:00Z",
  },
];

const initialResources = [
  {
    id: 1, groupId: 1,
    title: "Graph Algorithms Cheatsheet",
    type: "PDF", author: "Alex Johnson",
    uploadedAt: "2025-03-25T10:00:00Z",
    likes: 45, pinned: true, url: "#",
    description: "A comprehensive reference for BFS, DFS, Dijkstra & Bellman-Ford.",
    tags: ["Graphs", "DSA"],
    likedByUser: false,
  },
  {
    id: 2, groupId: 1,
    title: "Dynamic Programming Top 50 Patterns",
    type: "Video", author: "Maria Garcia",
    uploadedAt: "2025-03-20T10:00:00Z",
    likes: 120, pinned: false, url: "#",
    description: "Video series covering the most common DP patterns for interviews.",
    tags: ["DP", "LeetCode"],
    likedByUser: false,
  },
  {
    id: 3, groupId: 3,
    title: "React Router v6 Complete Guide",
    type: "Link", author: "Sam Smith",
    uploadedAt: "2025-03-27T04:00:00Z",
    likes: 32, pinned: false, url: "#",
    description: "Official docs + examples for React Router 6, including nested routes.",
    tags: ["React", "Routing"],
    likedByUser: false,
  },
  {
    id: 4, groupId: 1,
    title: "Tree Traversal Techniques",
    type: "PDF", author: "Priya Nair",
    uploadedAt: "2025-03-22T10:00:00Z",
    likes: 28, pinned: false, url: "#",
    description: "In-order, pre-order, post-order explained with diagrams.",
    tags: ["Trees", "DSA"],
    likedByUser: false,
  },
  {
    id: 5, groupId: 5,
    title: "Neural Networks from Scratch",
    type: "Video", author: "David Lee",
    uploadedAt: "2025-03-26T12:00:00Z",
    likes: 89, pinned: true, url: "#",
    description: "Build a neural network using only NumPy, step by step.",
    tags: ["ML", "Neural Nets"],
    likedByUser: false,
  },
  {
    id: 6, groupId: 3,
    title: "Tailwind CSS Cheatsheet",
    type: "PDF", author: "Elena M.",
    uploadedAt: "2025-03-27T08:00:00Z",
    likes: 55, pinned: false, url: "#",
    description: "Quick reference for all Tailwind utility classes.",
    tags: ["CSS", "Frontend"],
    likedByUser: false,
  },
  {
    id: 7, groupId: 2,
    title: "Calculus Limits Practice Set",
    type: "PDF", author: "Rahul S.",
    uploadedAt: "2025-03-23T10:00:00Z",
    likes: 18, pinned: false, url: "#",
    description: "50 practice problems on limits and continuity with solutions.",
    tags: ["Calculus", "Math"],
    likedByUser: false,
  },
];

const initialMessages = [
  {
    id: 1, groupId: 1,
    sender: "Alex Johnson", avatar: "AJ",
    text: "Hey everyone! Has anyone started on the weekly problems yet?",
    timestamp: "10:30 AM", isCurrentUser: false, isSystem: false,
  },
  {
    id: 2, groupId: 1,
    sender: "Maria Garcia", avatar: "MG",
    text: "Yes, I managed to solve the first two graph problems. Dynamic programming is still tricky though.",
    timestamp: "10:35 AM", isCurrentUser: false, isSystem: false,
  },
  {
    id: 3, groupId: 1,
    sender: "System", avatar: "",
    text: "Alex Johnson shared a resource: 'Graph Algorithms Cheatsheet'",
    timestamp: "10:45 AM", isCurrentUser: false, isSystem: true,
  },
  {
    id: 4, groupId: 1,
    sender: "You", avatar: "YO",
    text: "Thanks Alex! That cheatsheet is super helpful. Already bookmarked it.",
    timestamp: "11:20 AM", isCurrentUser: true, isSystem: false,
  },
  {
    id: 5, groupId: 3,
    sender: "Sam Smith", avatar: "SS",
    text: "Has anyone tried the new React Router v6 hooks? They're really clean!",
    timestamp: "09:00 AM", isCurrentUser: false, isSystem: false,
  },
  {
    id: 6, groupId: 3,
    sender: "You", avatar: "YO",
    text: "Yes! useNavigate is so much cleaner than the old history API.",
    timestamp: "09:05 AM", isCurrentUser: true, isSystem: false,
  },
];

// ─── Toast Queue ─────────────────────────────────────────────────────────────

let nextId = 100;
const genId = () => ++nextId;

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState = {
  groups: initialGroups,
  resources: initialResources,
  messages: initialMessages,
  toasts: [],
};

function reducer(state, action) {
  switch (action.type) {
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
        groups: state.groups.map(g => g.id === action.payload ? { ...g, pinned: !g.pinned } : g),
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
    case 'TOGGLE_LIKE':
      return {
        ...state,
        resources: state.resources.map(r =>
          r.id === action.payload
            ? { ...r, likedByUser: !r.likedByUser, likes: r.likedByUser ? r.likes - 1 : r.likes + 1 }
            : r
        ),
      };
    case 'TOGGLE_PIN_RESOURCE':
      return {
        ...state,
        resources: state.resources.map(r =>
          r.id === action.payload ? { ...r, pinned: !r.pinned } : r
        ),
      };

    // ── Messages ──
    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };

    // ── Toasts ──
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((message, type = 'success') => {
    const id = genId();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  // ── Groups ──
  const addGroup = useCallback((data) => {
    const group = { ...data, id: genId(), members: 1, recentActivity: new Date().toISOString(), createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_GROUP', payload: group });
    showToast(`Group "${group.name}" created!`);
    return group.id;
  }, [showToast]);

  const updateGroup = useCallback((data) => {
    dispatch({ type: 'UPDATE_GROUP', payload: data });
    showToast('Group updated successfully.');
  }, [showToast]);

  const deleteGroup = useCallback((id, name) => {
    dispatch({ type: 'DELETE_GROUP', payload: id });
    showToast(`Group "${name}" deleted.`, 'error');
  }, [showToast]);

  const togglePinGroup = useCallback((id) => {
    dispatch({ type: 'TOGGLE_PIN_GROUP', payload: id });
  }, []);

  // ── Resources ──
  const addResource = useCallback((data) => {
    const resource = { ...data, id: genId(), likes: 0, likedByUser: false, uploadedAt: new Date().toISOString() };
    dispatch({ type: 'ADD_RESOURCE', payload: resource });
    showToast('Resource shared successfully!');
  }, [showToast]);

  const updateResource = useCallback((data) => {
    dispatch({ type: 'UPDATE_RESOURCE', payload: data });
    showToast('Resource updated.');
  }, [showToast]);

  const deleteResource = useCallback((id) => {
    dispatch({ type: 'DELETE_RESOURCE', payload: id });
    showToast('Resource removed.', 'error');
  }, [showToast]);

  const toggleLike = useCallback((id) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: id });
  }, []);

  const togglePinResource = useCallback((id) => {
    dispatch({ type: 'TOGGLE_PIN_RESOURCE', payload: id });
  }, []);

  // ── Messages ──
  const sendMessage = useCallback((groupId, text) => {
    const msg = {
      id: genId(), groupId, sender: 'You', avatar: 'YO',
      text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true, isSystem: false,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: msg });
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const value = {
    ...state,
    addGroup, updateGroup, deleteGroup, togglePinGroup,
    addResource, updateResource, deleteResource, toggleLike, togglePinResource,
    sendMessage, showToast, removeToast,
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

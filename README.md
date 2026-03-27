# Project Structur

StudyHub/
│
├── client/                     # FRONTEND (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # images, icons
│   │   ├── components/         # reusable UI
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── GroupCard.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Filter.jsx
│   │   │
│   │   ├── pages/              # screens (Controller logic)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── GroupDetail.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── AddResource.jsx
│   │   │   ├── Activity.jsx
│   │   │
│   │   ├── services/           # API calls (Model layer)
│   │   │   ├── groupService.js
│   │   │   ├── resourceService.js
│   │   │   ├── authService.js
│   │   │
│   │   ├── context/            # global state
│   │   │   ├── AuthContext.js
│   │   │   ├── GroupContext.js
│   │   │
│   │   ├── hooks/              # custom hooks
│   │   │   ├── useFetch.js
│   │   │
│   │   ├── utils/              # helper functions
│   │   │   ├── formatDate.js
│   │   │
│   │   ├── styles/             # css/tailwind
│   │   ├── App.js
│   │   ├── index.js
│   │
│   └── package.json
│
├── server/                     # BACKEND (Node + Express)
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │
│   ├── models/                 # M (Data layer)
│   │   ├── Group.js
│   │   ├── Resource.js
│   │   ├── User.js
│   │
│   ├── controllers/            # C (Business logic)
│   │   ├── groupController.js
│   │   ├── resourceController.js
│   │   ├── authController.js
│   │
│   ├── routes/                 # Route handling
│   │   ├── groupRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── authRoutes.js
│   │
│   ├── middleware/             # auth, validation
│   │   ├── authMiddleware.js
│   │
│   ├── utils/                  # helpers
│   │   ├── generateToken.js
│   │
│   ├── uploads/                # file uploads (PDFs)
│   │
│   ├── server.js               # entry point
│   ├── package.json
│
├── .env                        # environment variables
├── README.md



# Data Models

1. User Model

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String // profile image URL
  },

  bio: String,

  joinedGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }
  ],

  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);

2. Group Model

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },

  description: String,

  topic: {
    type: String,
    index: true
  },

  semester: {
    type: Number,
    index: true
  },

  tags: [String],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  memberCount: {
    type: Number,
    default: 1
  },

  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },

  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Group", groupSchema);

3. Resource Model

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },

  description: String,

  link: String,

  fileUrl: String,

  type: {
    type: String,
    enum: ["LINK", "FILE"]
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
    index: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  tags: [String],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  likesCount: {
    type: Number,
    default: 0
  },

  isPinned: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("Resource", resourceSchema);

4. Message Model (Main Chat Storage)

const messageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
    index: true
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String
  },

  attachments: [String],

  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("Message", messageSchema);

5. ACTIVITY MODEL

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "CREATE_GROUP",
      "JOIN_GROUP",
      "ADD_RESOURCE",
      "LIKE_RESOURCE",
      "SEND_MESSAGE"
    ]
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  },

  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource"
  },

  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("Activity", activitySchema);


# FINAL DATA FLOW

User → creates Group
User → joins Group
User → uploads Resource (groupId)
User → sends Message (groupId)
System → logs Activity
Frontend → fetches using groupId
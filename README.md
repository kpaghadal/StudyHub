# StudyHub – Study Group & Resource Sharing Hub

## Project Structure

```
StudyHub/
│
├── client/                     # FRONTEND (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── index.js
│   │
│   └── package.json
│
├── server/                     # BACKEND (Node + Express)
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│
├── .env
└── README.md
```

## Data Models

### User
```js
{
  name,
  email,
  password,
  avatar,
  bio,
  joinedGroups[],
  role,
  createdAt
}
```

### Group
```js
{
  name,
  description,
  topic,
  semester,
  tags[],
  createdBy,
  members[],
  memberCount,
  lastMessage,
  lastActivity,
  createdAt
}
```

### Resource
```js
{
  title,
  description,
  link,
  fileUrl,
  type,
  groupId,
  uploadedBy,
  tags[],
  likes[],
  likesCount,
  isPinned,
  createdAt
}
```

### Message
```js
{
  groupId,
  senderId,
  message,
  attachments[],
  seenBy[],
  createdAt
}
```

### Activity
```js
{
  type,
  userId,
  groupId,
  resourceId,
  messageId,
  createdAt
}
```

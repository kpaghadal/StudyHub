export const mockGroups = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    topic: "Computer Science",
    semester: "Semester 3",
    description: "A group dedicated to mastering DSA with weekly mock interviews and problem-solving sessions.",
    members: 124,
    tags: ["DSA", "LeetCode", "Java"],
    recentActivity: "2 hours ago",
    pinned: true,
  },
  {
    id: 2,
    name: "Calculus III Study Group",
    topic: "Mathematics",
    semester: "Semester 2",
    description: "Sharing notes, past papers, and video lectures for advanced calculus.",
    members: 89,
    tags: ["Math", "Calculus", "Derivatives"],
    recentActivity: "Yesterday",
    pinned: false,
  },
  {
    id: 3,
    name: "Web Development Bootcamp",
    topic: "Software Engineering",
    semester: "Semester 4",
    description: "Learn full-stack web development. React, Node.js, and MongoDB resources.",
    members: 256,
    tags: ["React", "JavaScript", "Frontend"],
    recentActivity: "5 mins ago",
    pinned: true,
  },
  {
    id: 4,
    name: "Physics 101 Labs",
    topic: "Physics",
    semester: "Semester 1",
    description: "Group for sharing lab experiment data and write-up templates.",
    members: 45,
    tags: ["Physics", "Mechanics", "Lab"],
    recentActivity: "3 days ago",
    pinned: false,
  }
];

export const mockResources = [
  {
    id: 1,
    groupId: 1,
    title: "Graph Algorithms Cheatsheet",
    type: "PDF",
    author: "Alex Johnson",
    uploadedAt: "2 days ago",
    likes: 45,
    pinned: true,
    url: "#"
  },
  {
    id: 2,
    groupId: 1,
    title: "Dynamic Programming Top 50 Patterns",
    type: "Video",
    author: "Maria Garcia",
    uploadedAt: "1 week ago",
    likes: 120,
    pinned: false,
    url: "#"
  },
  {
    id: 3,
    groupId: 3,
    title: "React Router v6 Guide",
    type: "Link",
    author: "Sam Smith",
    uploadedAt: "4 hours ago",
    likes: 12,
    pinned: false,
    url: "#"
  }
];

export const mockMessages = [
  {
    id: 1,
    groupId: 1,
    sender: "Alex Johnson",
    text: "Hey everyone! Has anyone started on the weekly problems yet?",
    avatar: "AJ",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    groupId: 1,
    sender: "Maria Garcia",
    text: "Yes, I managed to solve the first two graph problems. Dynamic programming is still tricky for me though.",
    avatar: "MG",
    timestamp: "10:35 AM"
  },
  {
    id: 3,
    groupId: 1,
    sender: "System",
    text: "Alex Johnson shared a resource: 'Graph Algorithms Cheatsheet'",
    isSystem: true,
    timestamp: "10:45 AM"
  },
  {
    id: 4,
    groupId: 1,
    sender: "Rahul S.",
    text: "Thanks Alex! That cheatsheet is super helpful.",
    avatar: "RS",
    timestamp: "11:20 AM",
    isCurrentUser: true
  }
];

export const topics = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Software Engineering",
  "Engineering",
  "Business"
];

export const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8"
];

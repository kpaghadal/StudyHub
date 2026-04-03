import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, HelpCircle, User, X, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiFetch, parseResponse } from '../../utils/api';
import './DoubtChat.css';

const DoubtChat = () => {
  const { currentUser, socket, onlineUsers, showToast } = useApp();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  // Chat state
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingToQuestion, setReplyingToQuestion] = useState(null);
  
  const [recentChats, setRecentChats] = useState([]);
  const [activeTab, setActiveTab] = useState('online');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    fetchRecentChats();
  }, []);

  useEffect(() => {
    if (activeChatUser) {
      fetchPrivateMessages(activeChatUser._id);
    }
  }, [activeChatUser]);

  useEffect(() => {
    if (socket) {
      const handleReceiveQuestion = (questionData) => {
        setQuestions((prev) => [questionData, ...prev]);
        showToast('New doubt posted by ' + questionData.userId.name, 'info');
      };

      const handleReceiveReply = (replyData) => {
        if (replyData.senderId._id === activeChatUser?._id) {
          setMessages((prev) => [...prev, replyData]);
          scrollToBottom();
        } else {
          showToast(`New private message from ${replyData.senderId.name}`, 'info');
        }
        fetchRecentChats(); // refresh inbox
      };

      socket.on('receive_question', handleReceiveQuestion);
      socket.on('receive_reply', handleReceiveReply);

      return () => {
        socket.off('receive_question', handleReceiveQuestion);
        socket.off('receive_reply', handleReceiveReply);
      };
    }
  }, [socket, activeChatUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchQuestions = async () => {
    try {
      const res = await apiFetch('/doubts/questions');
      const data = await parseResponse(res);
      setQuestions(data);
    } catch (err) { }
  };

  const fetchRecentChats = async () => {
    try {
      const res = await apiFetch('/doubts/recent-chats');
      const data = await parseResponse(res);
      setRecentChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrivateMessages = async (userId) => {
    try {
      const res = await apiFetch(`/doubts/messages/${userId}`);
      const data = await parseResponse(res);
      setMessages(data);
      scrollToBottom();
    } catch (err) { }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const res = await apiFetch('/doubts/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newQuestion })
      });
      const data = await parseResponse(res);

      setQuestions([data, ...questions]);
      setNewQuestion('');
      showToast('Doubt posted to all online users!');

      if (socket) {
        socket.emit('send_question', data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    try {
      const res = await apiFetch('/doubts/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeChatUser._id,
          text: newMessage,
          questionId: replyingToQuestion?._id
        })
      });
      const data = await parseResponse(res);

      setMessages([...messages, data]);
      setNewMessage('');
      scrollToBottom();

      if (socket) {
        // Send exactly what the receiver expects (sender is us)
        socket.emit('send_reply', {
          ...data,
          receiverId: activeChatUser._id
        });
      }

      if (replyingToQuestion) {
        setReplyingToQuestion(null);
      }
      
      fetchRecentChats(); // Refresh inbox list when you send a message
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReplyClick = (q) => {
    if (q.userId._id === currentUser._id) {
      return showToast("You cannot reply to yourself", "info");
    }
    setActiveChatUser(q.userId);
    setReplyingToQuestion(q);
  };

  return (
    <div className="doubt-chat-container">
      {/* Sidebar for Online Users and Inbox */}
      <div className="online-users-sidebar">
        <div className="sidebar-tabs">
          <button className={`tab-btn ${activeTab === 'online' ? 'active' : ''}`} onClick={() => setActiveTab('online')}>Live Network</button>
          <button className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Inbox ({recentChats.length})</button>
        </div>
        
        <div className="users-list">
          {activeTab === 'online' ? (
            onlineUsers.length === 0 ? (
              <p className="no-users">Checking for users...</p>
            ) : (
              onlineUsers.map(user => (
                <div
                  key={user._id}
                  className={`user-card ${activeChatUser?._id === user._id ? 'active' : ''} ${user._id === currentUser._id ? 'self' : ''}`}
                  onClick={() => user._id !== currentUser._id && setActiveChatUser(user)}
                >
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info">
                    <span className="user-name">{user.name} {user._id === currentUser._id && '(You)'}</span>
                    <span className="user-status">Online now</span>
                  </div>
                </div>
              ))
            )
          ) : (
            recentChats.length === 0 ? (
              <p className="no-users">No private chats yet.</p>
            ) : (
              recentChats.map(chat => (
                <div
                  key={chat._id}
                  className={`user-card ${activeChatUser?._id === chat._id ? 'active' : ''}`}
                  onClick={() => setActiveChatUser(chat)}
                >
                  <div className="user-avatar">{chat.name ? chat.name.charAt(0).toUpperCase() : 'U'}</div>
                  <div className="user-info">
                    <span className="user-name">{chat.name || 'Unknown User'}</span>
                    <span className="chat-preview">{chat.lastMessage}</span>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="doubt-main-area">

        {/* Doubt Feed */}
        <div className={`doubt-feed ${activeChatUser ? 'contracted' : ''}`}>
          <div className="feed-header">
            <h2>Campus Doubts Hub</h2>
            <p>Ask a question. The whole campus is listening.</p>
          </div>

          <form className="post-doubt-form" onSubmit={handlePostQuestion}>
            <div className="input-wrapper">

              <input
                type="text"
                placeholder="What are you struggling with right now?"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
              />
              <button type="submit" disabled={!newQuestion.trim()}>Broadcast <Send size={16} /></button>
            </div>
          </form>

          <div className="questions-list">
            {questions.map(q => (
              <div key={q._id} className="question-card">
                <div className="question-header">
                  <div className="asker-info">
                    <div className="asker-avatar">{q.userId.name?.charAt(0) || 'S'}</div>
                    <span className="asker-name">{q.userId.name}</span>
                  </div>
                  <span className="question-time">
                    <Clock size={12} /> {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="question-text">{q.text}</p>
                <div className="question-actions">
                  <span className="replies-count"><MessageCircle size={14} /> {q.repliesCount} replies</span>
                  {q.userId._id === currentUser?._id ? (
                    <button className="reply-btn" style={{ background: '#10b981', color: 'white' }} onClick={() => setActiveTab('chats')}>
                      View Private Replies
                    </button>
                  ) : (
                    <button className="reply-btn" onClick={() => handleReplyClick(q)}>
                      Reply Privately
                    </button>
                  )}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="empty-state">No doubts posted yet. Be the first!</div>
            )}
          </div>
        </div>

        {/* Private Chat Panel */}
        {activeChatUser && (
          <div className="private-chat-panel">
            <div className="chat-header">
              <div className="chat-recipient">
                <div className="user-avatar">{activeChatUser.name.charAt(0)}</div>
                <div className="recipient-info">
                  <span className="recipient-name">{activeChatUser.name}</span>
                  <span className="recipient-status">Private Chat</span>
                </div>
              </div>
              <button className="close-chat" onClick={() => { setActiveChatUser(null); setReplyingToQuestion(null); }}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {replyingToQuestion && (
                <div className="replying-context">
                  <span className="context-label">Replying to their doubt:</span>
                  <p className="context-text">"{replyingToQuestion.text}"</p>
                  <button className="clear-context" onClick={() => setReplyingToQuestion(null)}><X size={12} /></button>
                </div>
              )}
              {messages.length === 0 ? (
                <p className="empty-chat">Say hello to {activeChatUser.name}!</p>
              ) : (
                messages.map((m, i) => (
                  <div key={m._id || i} className={`chat-bubble-wrapper ${m.senderId._id === currentUser._id ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      {m.questionId && <span className="reply-badge">in reply to a doubt</span>}
                      <p>{m.text}</p>
                      <span className="bubble-time">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendReply}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtChat;

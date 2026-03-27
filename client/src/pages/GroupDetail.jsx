import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGroups, mockResources, mockMessages } from '../data/mockData';
import { ArrowLeft, Plus, FileText, Video, Link as LinkIcon, Download, Heart, MessageSquare, Send } from 'lucide-react';
import AddResourceModal from '../components/AddResourceModal';
import './GroupDetail.css';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'resources'
  const [messageText, setMessageText] = useState('');
  
  const group = mockGroups.find(g => g.id === parseInt(id));
  const resources = mockResources.filter(r => r.groupId === parseInt(id));
  const messages = mockMessages.filter(m => m.groupId === parseInt(id));

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [activeTab, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    console.log("Sending msg:", messageText);
    // In a real app we'd add to state/backend here
    setMessageText('');
  };

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Group Not Found</h2>
        <button className="btn btn-outline mt-4" onClick={() => navigate('/app/groups')}>
          Back to Groups
        </button>
      </div>
    );
  }

  const renderIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText className="text-accent" />;
      case 'Video': return <Video className="text-primary" />;
      case 'Link': return <LinkIcon className="text-secondary" />;
      default: return <FileText />;
    }
  };

  return (
    <div className="group-detail-container">
      <div className="detail-header glass-card">
        <button className="btn-icon mb-2" onClick={() => navigate('/app/groups')}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="badge">{group.topic}</span>
              <span className="badge" style={{backgroundColor: '#dcfce7', color: '#166534'}}>{group.semester}</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">{group.name}</h1>
            <p className="text-muted max-w-2xl">{group.description}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsAddResourceOpen(true)}>
            <Plus size={18} />
            <span>Share Resource</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="detail-tabs mt-6">
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={18} /> Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <FileText size={18} /> Resources
          </button>
        </div>
      </div>

      <div className="detail-content grid-layout">
        <div className="main-column glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {activeTab === 'chat' ? (
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length > 0 ? messages.map(msg => (
                  msg.isSystem ? (
                    <div key={msg.id} className="system-message">
                      <span>{msg.text}</span>
                      <span className="msg-time">{msg.timestamp}</span>
                    </div>
                  ) : (
                    <div key={msg.id} className={`chat-bubble-wrapper ${msg.isCurrentUser ? 'current-user' : ''}`}>
                      {!msg.isCurrentUser && (
                        <div className="chat-avatar">{msg.avatar}</div>
                      )}
                      <div className={`chat-bubble ${msg.isCurrentUser ? 'bubble-primary' : 'bubble-light'}`}>
                        {!msg.isCurrentUser && <div className="chat-sender">{msg.sender}</div>}
                        <div className="chat-text">{msg.text}</div>
                        <div className="chat-time">{msg.timestamp}</div>
                      </div>
                    </div>
                  )
                )) : (
                  <div className="empty-state p-8">
                    <p className="text-muted">No messages yet. Say hi to the group!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-area border-t border-slate-200">
                <form className="chat-form" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Type a message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary p-2 rounded-full" disabled={!messageText.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="resources-container p-6">
              <h2 className="text-xl font-bold mb-4">Shared Resources</h2>
              <div className="resources-list">
                {resources.length > 0 ? resources.map(resource => (
                  <div key={resource.id} className="resource-item border border-slate-200 rounded-lg bg-slate-50">
                    <div className="resource-icon">
                      {renderIcon(resource.type)}
                    </div>
                    <div className="resource-info">
                      <h3 className="font-semibold text-lg">{resource.title}</h3>
                      <p className="text-sm text-muted">Shared by {resource.author} • {resource.uploadedAt}</p>
                    </div>
                    <div className="resource-actions">
                      <button className="btn-icon resource-like text-muted hover:text-accent">
                        <Heart size={18} />
                        <span className="text-xs ml-1">{resource.likes}</span>
                      </button>
                      <button className="btn-icon text-primary">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state p-8">
                    <p className="text-muted">No resources shared yet. Be the first!</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="side-column">
          <div className="glass-card p-4 mb-4">
            <h3 className="font-bold mb-2">Group Info</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="text-muted text-sm">Members:</span>
                <span className="font-semibold">{group.members}</span>
              </div>
              <div className="info-item">
                <span className="text-muted text-sm">Last Active:</span>
                <span className="font-semibold">{group.recentActivity}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <span key={tag} className="badge badge-outline">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAddResourceOpen && (
        <AddResourceModal onClose={() => setIsAddResourceOpen(false)} groupId={group.id} />
      )}
    </div>
  );
};

export default GroupDetail;

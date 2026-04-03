import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Settings, Check, CircleDot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { groups, resources, currentUser, notifications = [], markNotificationAsRead } = useApp();
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (n) => {
    if (!n.isRead && markNotificationAsRead) markNotificationAsRead(n._id);
    setShowNotifications(false);
    if (n.type === 'group_created' && n.groupId) {
      navigate('/app/groups');
    } else if (n.type === 'resource_added' && n.groupId) {
      navigate(`/app/groups/${n.groupId}?tab=resources`);
    } else if (n.type === 'message_added' && n.groupId) {
      navigate(`/app/groups/${n.groupId}?tab=chat`);
    }
  };

  const getInitials = (name) => {
    if(!name) return 'U';
    return name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  };

  const suggestions = searchQuery.length > 1 ? [
    ...groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(g => ({ label: g.name, path: `/app/groups/${g.id}`, type: 'group' })),
    ...resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(r => ({ label: r.title, path: '/app/resources', type: 'resource' })),
  ] : [];

  return (
    <header className="header">
      <div className="header-left">
        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate('/app')}>
          <div className="sidebar-avatar">
            <span className="avatar-text" style={{ fontSize: '1rem' }}>SH</span>
          </div>
          <div className="sidebar-profile-info" style={{ textAlign: 'left' }}>
            <h2 className="sidebar-profile-name text-primary">StudyHub</h2>
            <p className="sidebar-profile-role text-xs text-muted">DIGITAL ATELIER</p>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Global Search */}
        <div className="header-search" style={{ position: 'relative' }}>
          <Search className="search-icon" size={15} />
          <input
            type="text"
            placeholder="Search groups, resources..."
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setSearchQuery(''), 200)}
          />
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', borderRadius: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e0e3e5', overflow: 'hidden', zIndex: 200 }}>
              {suggestions.map((s, i) => (
                <button key={i} onMouseDown={() => { navigate(s.path); setSearchQuery(''); }} style={{ width: '100%', textAlign: 'left', padding: '0.625rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.82rem', color: '#191c1e', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', background: s.type === 'group' ? '#eef2ff' : '#fff7ed', color: s.type === 'group' ? '#6366f1' : '#f59e0b', textTransform: 'uppercase' }}>{s.type}</span>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="btn-icon header-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative', background: showNotifications ? '#f1f5f9' : 'transparent' }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="notification-dot" style={{ position: 'absolute', top: 4, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
            )}
          </button>
          
          {showNotifications && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: '#fff', borderRadius: '1rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Notifications</h3>
                {unreadCount > 0 && <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontWeight: 700 }}>{unreadCount} new</span>}
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n._id} 
                      onClick={() => handleNotificationClick(n)}
                      style={{ padding: '1rem', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: n.isRead ? '#fff' : '#f8fafc', display: 'flex', gap: '0.75rem', transition: 'background 0.2s' }}
                    >
                      <div style={{ marginTop: '0.2rem' }}>
                        {n.isRead ? <Check size={16} color="#94a3b8" /> : <CircleDot size={16} color="#3b82f6" />}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#0f172a', fontWeight: n.isRead ? 500 : 700, lineHeight: 1.4 }}>{n.message}</p>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.35rem', display: 'block' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg,#eef2ff,#ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1', fontSize: '0.75rem', fontFamily: 'Manrope, sans-serif', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/app/profile')}>
          {getInitials(currentUser?.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;

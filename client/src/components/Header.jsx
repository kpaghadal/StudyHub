import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { groups, resources } = useApp();

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

        <button className="btn-icon header-btn" style={{ position: 'relative' }}>
          <Bell size={17} />
          <span className="notification-dot" />
        </button>

        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg,#eef2ff,#ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1', fontSize: '0.75rem', fontFamily: 'Manrope, sans-serif', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/app/profile')}>
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Library, Users, Calendar, BarChart2, HelpCircle, LogOut, Plus, BookOpen, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CreateGroupModal from './CreateGroupModal';
import './Sidebar.css';

const navItems = [
  { to: '/app', end: true, icon: Home, label: 'Home' },
  { to: '/app/groups', icon: Users, label: 'Study Groups' },
  { to: '/app/resources', icon: BookOpen, label: 'Resources' },
  { to: '/app/library', icon: Library, label: 'My Library' },
  { to: '/app/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/app/events', icon: BarChart2, label: 'Events' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
  const [showCreate, setShowCreate] = useState(false);
  const { groups } = useApp();
  const navigate = useNavigate();
  const pinnedGroups = groups.filter(g => g.pinned).slice(0, 3);

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        {/* <div className="sidebar-profile">
          <div className="sidebar-avatar">
            <span className="avatar-text" style={{ fontSize: '1rem' }}>SH</span>
          </div>
          <div className="sidebar-profile-info">
            <h2 className="sidebar-profile-name text-primary">StudyHub</h2>
            <p className="sidebar-profile-role text-xs text-muted">DIGITAL ATELIER</p>
          </div>
        </div> */}

        <nav className="sidebar-nav mt-4">
          <ul className="nav-list">
            {navItems.map(item => (
              <li key={item.to} className="nav-item">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  <item.icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Create Group CTA */}
          <div style={{ marginTop: '1.25rem', padding: '0 0.25rem' }}>
            <button
              onClick={() => setShowCreate(true)}
              className="btn btn-primary w-full rounded-full py-2.5 shadow-md"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', borderRadius: '999px', padding: '0.625rem 1rem', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
            >
              <Plus size={16} /> New Group
            </button>
          </div>

          {/* Pinned Groups */}
          {pinnedGroups.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '0 0.25rem' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', marginBottom: '0.625rem', padding: '0 0.5rem' }}>Pinned Groups</p>
              {pinnedGroups.map(g => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/app/groups/${g.id}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f7f9fb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.4rem', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0, fontFamily: 'Manrope, sans-serif' }}>
                    {g.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#464554', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{g.name}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <ul className="nav-list">
            <li className="nav-item">
              <button className="nav-link w-full"><HelpCircle size={17} /><span>Help</span></button>
            </li>
            <li className="nav-item">
              <button className="nav-link w-full" style={{ color: 'var(--accent)' }} onClick={() => navigate('/')}>
                <LogOut size={17} /><span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </>
  );
};

export default Sidebar;

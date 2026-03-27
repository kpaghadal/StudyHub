import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Library, Bookmark, Settings, LogOut, Home } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Users size={24} color="white" />
          </div>
          <h1 className="logo-text">StudyHub</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/app" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/app/groups" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Library size={20} />
              <span>All Groups</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/app/saved" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Bookmark size={20} />
              <span>Saved Resources</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ul className="nav-list">
          <li className="nav-item">
            <button className="nav-link w-full">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link w-full text-accent">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

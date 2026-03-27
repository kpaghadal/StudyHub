import React, { useState } from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import './Header.css';

const Header = ({ onAddGroup }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header glass-panel">
      <div className="header-search">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search groups, topics, resources..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddGroup}>
          <Plus size={18} />
          <span className="hide-on-mobile">New Group</span>
        </button>
        
        <button className="btn-icon header-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">RS</div>
          <span className="user-name hide-on-mobile">Rahul S.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

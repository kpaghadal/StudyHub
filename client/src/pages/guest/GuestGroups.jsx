import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter } from 'lucide-react';
import './GuestPages.css';

const API = 'http://localhost:5000/api';

export default function GuestGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('All');
  const [topics, setTopics] = useState(['All']);

  useEffect(() => {
    fetch(`${API}/groups`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setGroups(list);
        const uniqueTopics = ['All', ...new Set(list.map(g => g.topic).filter(Boolean))];
        setTopics(uniqueTopics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = groups.filter(g => {
    const matchSearch = g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase());
    const matchTopic = topicFilter === 'All' || g.topic === topicFilter;
    return matchSearch && matchTopic;
  });

  const colors = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#0ea5e9,#6366f1)',
    'linear-gradient(135deg,#10b981,#0ea5e9)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#10b981,#6366f1)',
  ];

  return (
    <div className="guest-browse-page">
      {/* Page Header */}
      <div className="browse-hero">
        <div className="container">
          <div className="section-eyebrow">Explore Platform</div>
          <h1 className="browse-title">Study Groups</h1>
          <p className="browse-subtitle">Browse all active study communities. Join one to access discussions, resources, and more.</p>
          
          {/* Search + Filter */}
          <div className="browse-controls">
            <div className="search-wrap">
              <Search size={16} className="search-ico" />
              <input
                type="text"
                placeholder="Search groups by name or subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="browse-search"
              />
            </div>
            <div className="filter-wrap">
              <Filter size={15} />
              <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} className="browse-filter">
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="container browse-container">
        <div className="browse-count">
          {!loading && <span>{filtered.length} group{filtered.length !== 1 ? 's' : ''} found</span>}
        </div>
        {loading ? (
          <div className="cards-grid">
            {[...Array(9)].map((_, i) => <div key={i} className="guest-card skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No groups found</h3>
            <p>{search ? `No results for "${search}"` : 'No groups available yet.'}</p>
            <Link to="/register" className="btn btn-primary">Create a Group</Link>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((g, i) => {
              const memCount = g.memberCount || (Array.isArray(g.members) ? g.members.length : 0);
              return (
                <div key={g._id} className="guest-card group-card" style={{ animationDelay: `${(i % 9) * 60}ms` }}>
                  <div className="guest-card-banner" style={{ background: colors[i % colors.length] }}>
                    <span className="card-topic-pill">{g.topic || 'General'}</span>
                    {g.semester && <span className="card-semester-pill">{g.semester}</span>}
                  </div>
                  <div className="guest-card-body">
                    <h3 className="guest-card-title">{g.name}</h3>
                    <p className="guest-card-desc">{g.description?.slice(0, 100) || 'No description.'}{g.description?.length > 100 ? '...' : ''}</p>
                    <div className="guest-card-footer">
                      <span className="member-count"><Users size={13} /> {memCount} member{memCount !== 1 ? 's' : ''}</span>
                      <Link to="/register" className="card-join-btn">Join Group →</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

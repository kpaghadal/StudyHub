import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Video, Link as LinkIcon, Search, Filter, Heart } from 'lucide-react';
import './GuestPages.css';

const API = 'http://localhost:5000/api';

const TYPE_META = {
  PDF:      { color: '#ef4444', bg: '#fef2f2', icon: <FileText size={18} /> },
  Video:    { color: '#8b5cf6', bg: '#f5f3ff', icon: <Video size={18} /> },
  Link:     { color: '#0ea5e9', bg: '#f0f9ff', icon: <LinkIcon size={18} /> },
  Notes:    { color: '#10b981', bg: '#f0fdf4', icon: <FileText size={18} /> },
  Document: { color: '#f59e0b', bg: '#fffbeb', icon: <FileText size={18} /> },
};

const getMeta = (type) => TYPE_META[type] || { color: '#6366f1', bg: '#eef2ff', icon: <FileText size={18} /> };

export default function GuestResources() {
  const [resources, setResources] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [types, setTypes] = useState(['All']);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/resources`).then(r => r.json()),
      fetch(`${API}/groups`).then(r => r.json()),
    ]).then(([resData, grpData]) => {
      const list = Array.isArray(resData) ? resData : [];
      setResources(list);
      setGroups(Array.isArray(grpData) ? grpData : []);
      const uniqueTypes = ['All', ...new Set(list.map(r => r.type).filter(Boolean))];
      setTypes(uniqueTypes);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => {
    const matchSearch = r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.author?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const getGroupName = (groupId) => {
    const g = groups.find(g => g._id === groupId || g.id === groupId);
    return g?.name || 'General';
  };

  const timeAgo = (iso) => {
    if (!iso) return '';
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
  };

  return (
    <div className="guest-browse-page">
      {/* Page Header */}
      <div className="browse-hero browse-hero-resources">
        <div className="container">
          <div className="section-eyebrow">Shared Knowledge</div>
          <h1 className="browse-title">Resource Library</h1>
          <p className="browse-subtitle">Browse PDFs, notes, videos, and links shared by students across all groups.</p>
          
          <div className="browse-controls">
            <div className="search-wrap">
              <Search size={16} className="search-ico" />
              <input
                type="text"
                placeholder="Search by title, author, or topic..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="browse-search"
              />
            </div>
            <div className="filter-wrap">
              <Filter size={15} />
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="browse-filter">
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="container browse-container">
        <div className="browse-count">
          {!loading && <span>{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</span>}
        </div>
        {loading ? (
          <div className="res-cards-grid">
            {[...Array(9)].map((_, i) => <div key={i} className="res-card skeleton-card" style={{ height: 200 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No resources found</h3>
            <p>{search ? `No results for "${search}"` : 'Nothing shared yet.'}</p>
            <Link to="/register" className="btn btn-primary">Share a Resource</Link>
          </div>
        ) : (
          <div className="res-cards-grid">
            {filtered.map((r, i) => {
              const meta = getMeta(r.type);
              return (
                <div key={r._id} className="res-card" style={{ animationDelay: `${(i % 9) * 60}ms` }}>
                  <div className="res-card-top">
                    <div className="res-type-icon" style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon}
                    </div>
                    <span className="res-type-badge" style={{ background: meta.bg, color: meta.color }}>{r.type || 'File'}</span>
                  </div>
                  <h3 className="res-card-title">{r.title}</h3>
                  {r.description && (
                    <p className="res-card-desc">{r.description.slice(0, 80)}{r.description.length > 80 ? '...' : ''}</p>
                  )}
                  <div className="res-card-tags">
                    {(r.tags || []).slice(0, 3).map(t => (
                      <span key={t} className="res-tag">{t}</span>
                    ))}
                  </div>
                  <div className="res-card-footer">
                    <div className="res-meta-info">
                      <span className="res-author">{r.author || 'Scholar'}</span>
                      <span className="res-group">📁 {getGroupName(r.groupId)}</span>
                      <span className="res-date">{timeAgo(r.createdAt)}</span>
                    </div>
                    <div className="res-card-actions">
                      <span className="res-likes"><Heart size={12} /> {r.likes || 0}</span>
                      <Link to="/register" className="res-access-full-btn">Access →</Link>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookOpen, Users, Link as LinkIcon, FileText, PlayCircle, Heart, MessageCircle, Activity, Lightbulb } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { groups, resources, messages, currentUser } = useApp();

  const totalResources = resources.length;
  const totalGroups = groups.length;
  const totalMessages = messages.length;
  const recentResources = [...resources].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 4);

  // Build activity feed from messages + recent resource uploads
  const activityFeed = [
    ...resources.map(r => ({
      id: r._id || r.id,
      type: 'resource',
      title: r.title,
      group: groups.find(g => g._id === r.groupId || g.id === r.groupId)?.name || 'General',
      time: new Date(r.uploadedAt || r.createdAt),
      author: r.author || r.uploadedBy?.name || 'Unknown'
    })),
    ...messages.filter(m => !m.isSystem && m.isCurrentUser !== true).map(m => ({
      id: m._id || m.id,
      type: 'message',
      title: m.text?.slice(0, 60),
      group: groups.find(g => g._id === m.groupId || g.id === m.groupId)?.name || 'General',
      time: new Date(m.createdAt || m.time || Date.now()),
      author: m.sender || m.senderId?.name || 'Unknown'
    })),
  ].sort((a, b) => b.time - a.time).slice(0, 5);

  const timeAgo = (date) => {
    const m = Math.floor((Date.now() - date) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const typeIcon = (type) => {
    if (type?.toLowerCase()?.includes('video')) return <PlayCircle size={20} style={{ color: '#f59e0b' }} />;
    if (type?.toLowerCase()?.includes('link')) return <LinkIcon size={20} style={{ color: '#10b981' }} />;
    return <FileText size={20} style={{ color: '#6366f1' }} />;
  };

  const trendingGroups = [...groups].sort((a, b) => (b.memberCount || b.members?.length || 0) - (a.memberCount || a.members?.length || 0)).slice(0, 2);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dash-title">
          Welcome back, <span>{currentUser?.name?.split(' ')[0] || 'Scholar'}</span> 👋
        </h1>
        <p className="dash-subtitle">Your collaborative ecosystem is humming with activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Active Groups"
          value={totalGroups}
          delta={`+${Math.min(totalGroups, 3)} new`}
          sub="Communities established"
          icon={<Users size={24} />}
          onClick={() => navigate('/app/groups')}
        />
        <StatCard
          title="Resources Shared"
          value={totalResources}
          delta="Expanding library"
          sub="Across all topics"
          icon={<BookOpen size={24} />}
          onClick={() => navigate('/app/resources')}
        />
        <StatCard
          title="Total Messages"
          value={totalMessages}
          delta="High engagement"
          sub="Conversations ongoing"
          icon={<MessageCircle size={24} />}
          onClick={() => navigate('/app/groups')}
        />
      </div>

      {/* Main Content */}
      <div className="dash-grid">

        {/* Left Column: Feed + Trending */}
        <div className="dash-section">

          {/* Recent Activity */}
          <section>
            <div className="section-header">
              <div>
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <button className="view-all-btn" onClick={() => navigate('/app/groups')}>View Feed →</button>
            </div>

            <div className="activity-list">
              {activityFeed.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-icon-wrapper ${a.type}`}>
                    {a.type === 'resource' ? <BookOpen size={18} /> : <MessageCircle size={18} />}
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      {a.type === 'resource' ? `${a.author} shared "${a.title}"` : `${a.author}: ${a.title}`}
                    </p>
                    <p className="activity-sub">in <span className="activity-group">{a.group}</span></p>
                  </div>
                  <span className="activity-time">{timeAgo(a.time)}</span>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'white', borderRadius: '1.25rem' }}>
                  <Activity size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>No recent activity — break the ice!</p>
                </div>
              )}
            </div>
          </section>

          {/* Trending Groups */}
          <section style={{ marginTop: '1rem' }}>
            <div className="section-header">
              <h2 className="section-title">Trending Communities</h2>
            </div>

            <div className="trending-grid">
              {trendingGroups.map((g, i) => {
                const colors = [
                  `linear-gradient(135deg, #4f46e5, #ec4899)`,
                  `linear-gradient(135deg, #0ea5e9, #10b981)`
                ];
                const memCount = g.memberCount || g.members?.length || 0;

                return (
                  <div key={g._id || g.id} className="trend-card" onClick={() => navigate(`/app/groups/${g._id || g.id}`)}>
                    <div className="trend-banner" style={{ background: colors[i % colors.length] }}>
                      <span className="trend-badge">{memCount > 5 ? '🔥 Hot' : '✨ Active'}</span>
                    </div>

                    <div className="trend-body">
                      <h3 className="trend-name">{g.name}</h3>
                      <p className="trend-desc">{g.description}</p>

                      <div className="trend-footer">
                        <span className="trend-members">{memCount} members</span>
                        <button className="trend-action" onClick={(e) => { e.stopPropagation(); navigate(`/app/groups/${g._id || g.id}`); }}>
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Mini Library & Tips */}
        <div className="dash-section">

          <div className="resources-box">
            <div className="section-header">
              <h2 className="section-title">Fresh Materials</h2>
              <button className="view-all-btn" onClick={() => navigate('/app/resources')}>All →</button>
            </div>

            <div className="res-list">
              {recentResources.map(r => (
                <div key={r._id || r.id} className="res-item" onClick={() => navigate('/app/resources')}>
                  <div className="res-icon">
                    {typeIcon(r.type || r.resourceType)}
                  </div>
                  <div className="res-info">
                    <p className="res-title">{r.title}</p>
                    <p className="res-author">by {r.author || r.uploadedBy?.name || 'Scholar'}</p>
                  </div>
                  <div className="res-likes">
                    <Heart size={14} style={{ color: '#ef4444' }} /> {r.likes || 0}
                  </div>
                </div>
              ))}
              {recentResources.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', padding: '2rem 0' }}>No materials yet.</p>
              )}
            </div>

            <button className="browse-btn" onClick={() => navigate('/app/resources')}>
              Access Resource Vault
            </button>
          </div>

          <div className="tip-card">
            <BookOpen size={120} className="tip-bg-icon" />
            <h3><Lightbulb size={20} /> Developer Tip</h3>
            <p>Group notifications are now live! If a new relevant problem occurs in your groups, you'll be instantly notified across the hub.</p>
            <button className="tip-btn" onClick={() => navigate('/app/groups')}>Join more groups</button>
          </div>
          <br /><br /><br /><br />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, delta, sub, icon, onClick }) {
  return (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">
        {value}
        <span className="stat-delta">{delta}</span>
      </div>
      <p className="stat-desc">{sub}</p>
    </div>
  );
}

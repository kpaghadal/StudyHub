import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, Users, TrendingUp, Bookmark, PlayCircle, FileText, Link as LinkIcon, Heart, Plus, Activity } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { groups, resources, messages, currentUser } = useApp();
  const [addResOpen, setAddResOpen] = useState(false);

  const totalResources = resources.length;
  const totalGroups = groups.length;
  const recentResources = [...resources].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 4);

  // Build activity feed from messages + recent resource uploads
  const activityFeed = [
    ...resources.map(r => ({ type: 'resource', title: r.title, group: groups.find(g => g.id === r.groupId)?.name || 'Unknown', time: new Date(r.uploadedAt), author: r.author })),
    ...messages.filter(m => !m.isSystem && m.isCurrentUser !== true).map(m => ({ type: 'message', title: m.text.slice(0, 60), group: groups.find(g => g.id === m.groupId)?.name || 'Unknown', time: new Date(), author: m.sender })),
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
    if (type === 'Video') return <PlayCircle size={15} style={{ color: '#f59e0b' }} />;
    if (type === 'Link') return <LinkIcon size={15} style={{ color: '#10b981' }} />;
    return <FileText size={15} style={{ color: '#6366f1' }} />;
  };

  const trendingGroups = [...groups].sort((a, b) => b.memberCount - a.memberCount).slice(0, 2);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>
          Welcome back, <span style={{ color: '#6366f1' }}>{currentUser?.name?.split(' ')[0] || 'Scholar'}</span> 👋
        </h1>
        <p style={{ color: '#767586', fontSize: '0.875rem' }}>Your collaborative ecosystem is humming with activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="TOTAL GROUPS"
          value={totalGroups}
          delta={`+${Math.min(totalGroups, 2)} new`}
          sub="Across all topics"
          icon={<Users size={36} style={{ color: '#e0e3e5' }} />}
          onClick={() => navigate('/app/groups')}
        />
        <StatCard
          title="RESOURCES"
          value={totalResources}
          delta="New this week"
          sub="Across all groups"
          icon={<BookOpen size={36} style={{ color: '#e0e3e5' }} />}
          onClick={() => navigate('/app/resources')}
        />
        <div className="stat-card" style={{ cursor: 'default' }}>
          <h3 className="stat-title" style={{ marginBottom: '0.75rem' }}>DAILY ACTIVITY</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '4rem', gap: '0.35rem' }}>
            {[40, 65, 45, 80, 55, 70, 48, 85].map((v, i) => (
              <div key={i} style={{ flex: 1, borderRadius: '0.25rem 0.25rem 0 0', background: i === 7 ? '#6366f1' : '#eef2ff', height: `${v}%`, transition: 'height 0.3s' }} />
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: '#767586', marginTop: '0.625rem', textAlign: 'center' }}>Peak hours: 10AM – 2PM</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="dash-grid">

        {/* Left: Activity + Trending */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recent Activity */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#191c1e' }}>Recent Activity</h2>
                <p style={{ fontSize: '0.72rem', color: '#767586' }}>Real-time updates from your groups</p>
              </div>
              <button onClick={() => navigate('/app/groups')} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activityFeed.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', background: '#fff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: a.type === 'resource' ? '#eef2ff' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {a.type === 'resource' ? <BookOpen size={13} style={{ color: '#6366f1' }} /> : <Users size={13} style={{ color: '#22c55e' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', color: '#191c1e', fontWeight: 600, marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.type === 'resource' ? `${a.author} shared "${a.title}"` : `${a.author}: ${a.title}`}</p>
                    <p style={{ fontSize: '0.7rem', color: '#767586' }}>in <span style={{ color: '#6366f1', fontWeight: 600 }}>{a.group}</span></p>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#767586', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(a.time)}</span>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#767586', background: '#fff', borderRadius: '1rem' }}>
                  <Activity size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.875rem' }}>No activity yet — join a group to get started!</p>
                </div>
              )}
            </div>
          </section>

          {/* Trending Groups */}
          <section>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#191c1e' }}>Trending Groups</h2>
              <p style={{ fontSize: '0.72rem', color: '#767586' }}>Communities seeing the most engagement</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {trendingGroups.map(g => (
                <div key={g.id} onClick={() => navigate(`/app/groups/${g.id}`)} style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}>
                  <div style={{ height: '5rem', background: `linear-gradient(135deg, hsl(${g.id * 50}, 60%, 30%), hsl(${g.id * 50 + 40}, 70%, 50%))`, display: 'flex', alignItems: 'center', padding: '1rem', position: 'relative' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px', position: 'absolute', top: '0.625rem', left: '0.625rem', textTransform: 'uppercase' }}>
                      {g.memberCount > 200 ? '🔥 HOT' : '✨ NEW'}
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#191c1e', marginBottom: '0.375rem' }}>{g.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#767586', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.description}</p>
                    <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem' }}>
                      {g.tags.slice(0, 2).map(t => <span key={t} style={{ background: '#eef2ff', color: '#6366f1', fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.625rem', borderRadius: '999px' }}>{g.memberCount} members</span>
                      <button onClick={e => { e.stopPropagation(); navigate(`/app/groups/${g.id}`); }} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.375rem 0.875rem', borderRadius: '999px', border: 'none', cursor: 'pointer' }}>View Group</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Resources */}
        <div>
          <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e' }}>Recently Added</h2>
              <button onClick={() => navigate('/app/resources')} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {recentResources.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.875rem', background: '#f7f9fb', cursor: 'pointer' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {typeIcon(r.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191c1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                    <p style={{ fontSize: '0.68rem', color: '#767586' }}>by {r.author}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: '#767586' }}>
                    <Heart size={11} style={{ color: '#ef4444' }} /> {r.likes}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/app/resources')} style={{ width: '100%', marginTop: '1rem', padding: '0.625rem', borderRadius: '999px', border: '1px solid #e0e3e5', background: '#fff', color: '#191c1e', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Browse All Resources</button>
          </div>

          {/* Pro Tip */}
          <div style={{ marginTop: '1rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '1.5rem', padding: '1.5rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', opacity: 0.1 }}><BookOpen size={80} /></div>
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>Pro Tip 💡</h3>
            <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: '1rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>Pin study groups to your sidebar for instant access. Upload resources directly from group pages.</p>
            <button onClick={() => navigate('/app/groups')} style={{ background: 'rgba(255,255,255,0.95)', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 }}>Explore Groups →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, delta, sub, icon, onClick }) {
  return (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="stat-card-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon-wrapper">{icon}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#6366f1', fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.25rem' }}>↑ {delta}</span>
      </div>
      <p style={{ fontSize: '0.7rem', color: '#767586', marginTop: '0.375rem' }}>{sub}</p>
    </div>
  );
}

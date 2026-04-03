import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, BookOpen, Activity, Edit2, Settings, Bookmark, Heart, Trash2, FileText, Video, Link as LinkIcon, Pin } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import AddResourceModal from '../components/AddResourceModal';

export default function Profile() {
  const navigate = useNavigate();
  const { groups, resources, togglePinResource, currentUser, deleteResource } = useApp();
  const [deleteResConfirm, setDeleteResConfirm] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);

  // Dynamic derivations based on Mongo ID / Name
  const myResources = resources.filter(r => r.author === currentUser?.name).slice(0, 6);
  const pinnedResources = resources.filter(r => r.pinned).slice(0, 4);
  const joinedGroups = groups.filter(g => g.joined).slice(0, 4);

  const getInitials = (name) => {
    if(!name) return 'U';
    return name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  };

  const timeAgo = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
  };

  const typeIcon = (type) => {
    const map = { PDF: FileText, Video, Link: LinkIcon, Notes: FileText };
    const Icon = map[type] || FileText;
    return <Icon size={16} />;
  };

  const typeColor = (type) => ({ PDF: '#eef2ff', Video: '#fff7ed', Link: '#f0fdf4', Notes: '#fdf4ff' }[type] || '#eef2ff');
  const typeTextColor = (type) => ({ PDF: '#6366f1', Video: '#f59e0b', Link: '#10b981', Notes: '#a855f7' }[type] || '#6366f1');

  const activityItems = [
    { icon: <BookOpen size={14} />, title: 'Uploaded Resource', desc: 'Shared "Graph Algorithms Cheatsheet" in Data Structures.', time: '2h ago', color: '#eef2ff', iconColor: '#6366f1' },
    { icon: <Users size={14} />, title: 'Joined Group', desc: 'Joined "Machine Learning Fundamentals".', time: 'Yesterday', color: '#f0fdf4', iconColor: '#10b981' },
    { icon: <Heart size={14} />, title: 'Liked Resource', desc: 'Liked "Neural Networks from Scratch".', time: '2d ago', color: '#fff1f2', iconColor: '#ef4444' },
    { icon: <Pin size={14} />, title: 'Pinned Resource', desc: 'Pinned "React Router v6 Guide" for easy access.', time: '3d ago', color: '#fffbeb', iconColor: '#f59e0b' },
  ];

  return (
    <div style={{ paddingBottom: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{ background: '#fff', borderRadius: '1.75rem', padding: '2.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 280, background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: 'linear-gradient(135deg, #eef2ff, #ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#6366f1', fontFamily: 'Manrope, sans-serif', border: '4px solid #fff', boxShadow: '0 8px 24px rgba(99,102,241,0.2)' }}>
              {getInitials(currentUser?.name)}
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
              <Edit2 size={13} />
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.875rem', color: '#191c1e', marginBottom: '0.25rem' }}>{currentUser?.name || 'Student'}</h1>
            <p style={{ color: '#767586', fontSize: '0.875rem', marginBottom: '1rem' }}>{currentUser?.email || 'student@university.edu'}</p>
            
            
          </div>

          {/* Stats + Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <button style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#f2f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#767586' }}>
              <Settings size={16} />
            </button>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[{ v: myResources.length, l: 'Resources' }, { v: joinedGroups.length, l: 'Groups' }, { v: currentUser?.likedResources?.length || 0, l: 'Likes Given' }].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#191c1e', lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontSize: '0.68rem', color: '#767586', fontWeight: 600, marginTop: '0.2rem' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Learning Stats */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#767586', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>Learning Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { icon: <BookOpen size={18} />, bg: '#eef2ff', c: '#6366f1', val: myResources.length, label: 'Resources Shared' },
              { icon: <Users size={18} />, bg: '#f0fdf4', c: '#10b981', val: joinedGroups.length, label: 'Active Groups' },
              { icon: <Pin size={18} />, bg: '#fffbeb', c: '#f59e0b', val: currentUser?.pinnedGroups?.length || 0, label: 'Pinned Groups' },
              { icon: <Heart size={18} />, bg: '#fff1f2', c: '#ef4444', val: currentUser?.likedResources?.length || 0, label: 'Resources Liked' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: s.bg, color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#191c1e', lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: '0.72rem', color: '#767586', fontWeight: 500 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#767586', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activityItems.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: a.color, color: a.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#191c1e', marginBottom: '0.15rem' }}>{a.title}</p>
                  <p style={{ fontSize: '0.72rem', color: '#767586', lineHeight: 1.4 }}>{a.desc}</p>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#767586', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Groups */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e' }}>My Study Groups</h2>
            <button onClick={() => navigate('/app/groups')} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {joinedGroups.map(g => (
              <div key={g.id} onClick={() => navigate(`/app/groups/${g.id}`)} style={{ background: '#fff', borderRadius: '1.25rem', padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg,#eef2ff,#ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#6366f1', fontFamily: 'Manrope, sans-serif' }}>{g.name.charAt(0)}</div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, background: '#f2f4f6', color: '#767586', padding: '0.15rem 0.5rem', borderRadius: '999px', textTransform: 'uppercase' }}>{g.topic.split(' ')[0]}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#191c1e', marginBottom: '0.375rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.name}</h4>
                <p style={{ fontSize: '0.68rem', color: '#767586', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={10} /> {g.memberCount} members</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned / Saved Resources */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e' }}>📌 Pinned Resources</h2>
            <button onClick={() => navigate('/app/library')} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>View Library →</button>
          </div>
          <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            {pinnedResources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#767586' }}>
                <Bookmark size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.875rem' }}>No pinned resources yet.</p>
              </div>
            ) : (
              pinnedResources.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: i < pinnedResources.length - 1 ? '1px solid #f2f4f6' : 'none' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: typeColor(r.type), color: typeTextColor(r.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{typeIcon(r.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#191c1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                    <p style={{ fontSize: '0.68rem', color: '#767586' }}>From: {groups.find(g => g.id === r.groupId)?.name || 'Unknown'}</p>
                  </div>
                  <button onClick={() => togglePinResource(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}><Bookmark size={15} style={{ fill: '#6366f1' }} /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {deleteResConfirm && (
        <ConfirmDialog title="Remove Resource" message={`Remove "${deleteResConfirm.title}" from your library?`}
          onConfirm={() => { deleteResource(deleteResConfirm.id); setDeleteResConfirm(null); }}
          onCancel={() => setDeleteResConfirm(null)} />
      )}
      {showAddRes && <AddResourceModal onClose={() => setShowAddRes(false)} />}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bookmark, FileText, Video, Link as LinkIcon, Heart, Download, Trash2, Pin, Search, X } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Library() {
  const { resources, groups, toggleLike, togglePinResource, deleteResource } = useApp();
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const pinned = resources.filter(r => r.pinned);
  const liked = resources.filter(r => r.likedByUser);
  const all = [...resources].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  const getGroup = (gid) => groups.find(g => g.id === gid)?.name || 'Unknown';

  const typeIcon = (type) => {
    if (type === 'Video') return <Video size={16} />;
    if (type === 'Link') return <LinkIcon size={16} />;
    return <FileText size={16} />;
  };
  const typeStyle = (type) => ({
    bg: ({ PDF: '#eef2ff', Video: '#fff7ed', Link: '#f0fdf4', Notes: '#fdf4ff' }[type] || '#eef2ff'),
    color: ({ PDF: '#6366f1', Video: '#f59e0b', Link: '#10b981', Notes: '#a855f7' }[type] || '#6366f1'),
  });

  const filteredAll = all.filter(r => {
    const q = query.toLowerCase();
    return !q || r.title.toLowerCase().includes(q) || r.author?.toLowerCase().includes(q);
  });

  const timeAgo = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today'; if (d === 1) return 'Yesterday'; return `${d}d ago`;
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eef2ff', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>SAVED</span>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>My Library</h1>
        <p style={{ color: '#767586', fontSize: '0.875rem' }}>Your pinned, liked, and saved resources in one place.</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f2f4f6', borderRadius: '999px', padding: '0.5rem 1rem', maxWidth: '340px', marginBottom: '2rem' }}>
        <Search size={15} style={{ color: '#767586', flexShrink: 0 }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your library…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: '#191c1e', width: '100%', fontFamily: 'Inter, sans-serif' }} />
        {query && <X size={14} style={{ color: '#767586', cursor: 'pointer' }} onClick={() => setQuery('')} />}
      </div>

      {/* Pinned */}
      <Section title="📌 Pinned" count={pinned.length} onViewAll={() => navigate('/app/resources')}>
        {pinned.length === 0 ? (
          <EmptyState icon={<Pin size={20} />} msg="No pinned resources yet. Pin resources from any group page." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {pinned.map(r => <ResCard key={r.id} r={r} getGroup={getGroup} typeIcon={typeIcon} typeStyle={typeStyle} timeAgo={timeAgo} toggleLike={toggleLike} togglePin={togglePinResource} onDelete={() => setDeleteTarget(r)} />)}
          </div>
        )}
      </Section>

      {/* Liked */}
      <Section title="❤️ Liked" count={liked.length} onViewAll={() => navigate('/app/resources')}>
        {liked.length === 0 ? (
          <EmptyState icon={<Heart size={20} />} msg="Resources you like will appear here." />
        ) : (
          <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            {liked.map((r, i) => {
              const s = typeStyle(r.type);
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: i < liked.length - 1 ? '1px solid #f2f4f6' : 'none' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{typeIcon(r.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#191c1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                    <p style={{ fontSize: '0.7rem', color: '#767586' }}>{getGroup(r.groupId)} · {timeAgo(r.uploadedAt)}</p>
                  </div>
                  <button onClick={() => toggleLike(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 600 }}>
                    <Heart size={14} style={{ fill: '#ef4444' }} /> {r.likes}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* All Resources */}
      <Section title="📚 All Resources" count={filteredAll.length}>
        {filteredAll.length === 0 ? (
          <EmptyState icon={<FileText size={20} />} msg="No resources found." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filteredAll.map(r => <ResCard key={r.id} r={r} getGroup={getGroup} typeIcon={typeIcon} typeStyle={typeStyle} timeAgo={timeAgo} toggleLike={toggleLike} togglePin={togglePinResource} onDelete={() => setDeleteTarget(r)} />)}
          </div>
        )}
      </Section>

      {deleteTarget && (
        <ConfirmDialog title="Delete Resource" message={`Remove "${deleteTarget.title}"?`}
          onConfirm={() => { deleteResource(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}

function Section({ title, count, onViewAll, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#191c1e' }}>
          {title} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#767586', background: '#f2f4f6', padding: '0.15rem 0.5rem', borderRadius: '999px', marginLeft: '0.375rem' }}>{count}</span>
        </h2>
        {onViewAll && <button onClick={onViewAll} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>Browse All →</button>}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return (
    <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', color: '#767586', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div style={{ opacity: 0.3, marginBottom: '0.75rem' }}>{icon}</div>
      <p style={{ fontSize: '0.875rem' }}>{msg}</p>
    </div>
  );
}

function ResCard({ r, getGroup, typeIcon, typeStyle, timeAgo, toggleLike, togglePin, onDelete }) {
  const s = typeStyle(r.type);
  return (
    <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', border: r.pinned ? '1px solid #a5b4fc' : '1px solid transparent', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{typeIcon(r.type)}</div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={() => togglePin(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: r.pinned ? '#6366f1' : '#c7c4d7', padding: '0.25rem' }}><Bookmark size={14} style={{ fill: r.pinned ? '#6366f1' : 'none' }} /></button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e0e3e5', padding: '0.25rem' }}><Trash2 size={13} /></button>
        </div>
      </div>
      <h4 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: '#191c1e', marginBottom: '0.25rem', lineHeight: 1.3 }}>{r.title}</h4>
      <p style={{ fontSize: '0.7rem', color: '#767586', marginBottom: '0.875rem' }}>{getGroup(r.groupId)} · {timeAgo(r.uploadedAt)}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f2f4f6', paddingTop: '0.75rem', marginTop: 'auto' }}>
        <button onClick={() => toggleLike(r.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: r.likedByUser ? '#ef4444' : '#767586', fontSize: '0.75rem', fontWeight: 600 }}>
          <Heart size={13} style={{ fill: r.likedByUser ? '#ef4444' : 'none' }} /> {r.likes}
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f7f9fb', border: 'none', cursor: 'pointer', color: '#767586', fontSize: '0.72rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '999px' }}>
          <Download size={12} /> Download
        </button>
      </div>
    </div>
  );
}

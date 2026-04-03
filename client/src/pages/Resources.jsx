import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, FileText, Video, Link as LinkIcon, Heart, Download,
  Bookmark, Pin, Plus, X, SlidersHorizontal, Trash2,
  Copy, ExternalLink, File, CheckCheck, Users
} from 'lucide-react';
import AddResourceModal from '../components/AddResourceModal';
import ConfirmDialog from '../components/ConfirmDialog';

const TYPE_META = {
  PDF:      { bg: '#eef2ff', color: '#6366f1',  label: 'PDF' },
  Document: { bg: '#f3f0ff', color: '#8b5cf6',  label: 'Document' },
  Notes:    { bg: '#fdf4ff', color: '#a855f7',  label: 'Notes' },
  Video:    { bg: '#fff7ed', color: '#f59e0b',  label: 'Video' },
  Link:     { bg: '#f0fdf4', color: '#10b981',  label: 'Link' },
};

const typeIcon  = (type, size = 18) => {
  if (type === 'Video') return <Video size={size} />;
  if (type === 'Link')  return <LinkIcon size={size} />;
  if (type === 'Document') return <File size={size} />;
  return <FileText size={size} />;
};
const typeMeta  = (type) => TYPE_META[type] || TYPE_META.PDF;
const timeAgo   = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return 'Today'; if (d === 1) return 'Yesterday'; return `${d}d ago`;
};

export default function Resources() {
  const { resources, groups, toggleLike, togglePinResource, deleteResource, currentUser } = useApp();
  const [query,       setQuery]       = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [sortBy,      setSortBy]      = useState('recent');
  const [showAdd,     setShowAdd]     = useState(false);
  const [deleteTarget,setDeleteTarget]= useState(null);

  const topics = ['All', ...new Set(groups.map(g => g.topic))];
  const types  = ['All', 'PDF', 'Document', 'Notes', 'Video', 'Link'];

  const getGroup     = (gid) => groups.find(g => g.id === gid);
  const getGroupName = (gid) => getGroup(gid)?.name || 'Unknown Group';
  const getGroupTopic= (gid) => getGroup(gid)?.topic || '';

  const filtered = resources
    .filter(r => {
      const q = query.toLowerCase();
      const matchQ = !q || r.title?.toLowerCase().includes(q) || r.author?.toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q));
      const matchType  = typeFilter  === 'All' || r.type === typeFilter;
      const matchTopic = topicFilter === 'All' || getGroupTopic(r.groupId) === topicFilter;
      return matchQ && matchType && matchTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'recent')  return new Date(b.createdAt || b.uploadedAt) - new Date(a.createdAt || a.uploadedAt);
      if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'name')    return a.title?.localeCompare(b.title);
      return 0;
    });

  const pinned = filtered.filter(r => r.pinned);
  const rest   = filtered.filter(r => !r.pinned);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eef2ff', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>LIBRARY</span>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>Resource Library</h1>
          <p style={{ color: '#767586', fontSize: '0.875rem' }}>Browse, discover, and share knowledge across all your groups.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f2f4f6', borderRadius: '999px', padding: '0.5rem 1rem', width: '220px' }}>
            <Search size={15} style={{ color: '#767586', flexShrink: 0 }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources…"
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: '#191c1e', width: '100%', fontFamily: 'Inter, sans-serif' }} />
            {query && <X size={14} style={{ color: '#767586', cursor: 'pointer', flexShrink: 0 }} onClick={() => setQuery('')} />}
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Share Resource
          </button>
        </div>
      </div>

      {/* ── Type Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {types.map(t => {
          const m = TYPE_META[t];
          return (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px',
              border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap',
              background: typeFilter === t ? '#6366f1' : '#fff', color: typeFilter === t ? '#fff' : '#767586',
              boxShadow: typeFilter === t ? '0 4px 12px rgba(99,102,241,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s'
            }}>
              {t !== 'All' && typeIcon(t, 13)}
              {t}
            </button>
          );
        })}
      </div>

      {/* ── Filters Row ── */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#767586', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><SlidersHorizontal size={13} /> Filter:</span>
        <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} style={selS}>
          {topics.map(t => <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selS}>
          <option value="recent">Sort: Recent</option>
          <option value="popular">Sort: Popular</option>
          <option value="name">Sort: A–Z</option>
        </select>
        <span style={{ fontSize: '0.75rem', color: '#767586', marginLeft: 'auto' }}>{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* ── Pinned Section ── */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Pin size={14} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586' }}>Pinned Resources</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
            {pinned.map(r => (
              <ResourceCard key={r.id} r={r} currentUser={currentUser} getGroup={getGroup} getGroupName={getGroupName}
                toggleLike={toggleLike} togglePinResource={togglePinResource} onDelete={() => setDeleteTarget(r)} isPinned />
            ))}
          </div>
        </div>
      )}

      {/* ── All Resources ── */}
      {rest.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
          {rest.map(r => (
            <ResourceCard key={r.id} r={r} currentUser={currentUser} getGroup={getGroup} getGroupName={getGroupName}
              toggleLike={toggleLike} togglePinResource={togglePinResource} onDelete={() => setDeleteTarget(r)} />
          ))}
        </div>
      ) : (
        filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: '#191c1e', marginBottom: '0.5rem' }}>No resources found</h3>
            <p style={{ fontSize: '0.875rem', color: '#767586', marginBottom: '1.5rem' }}>Try different filters or be the first to share!</p>
            <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Share First Resource
            </button>
          </div>
        )
      )}

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }}>
        <Plus size={22} />
      </button>

      {showAdd && <AddResourceModal onClose={() => setShowAdd(false)} />}
      {deleteTarget && (
        <ConfirmDialog title="Delete Resource" message={`Remove "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={() => { deleteResource(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}

/* ──────────────────── Resource Card ──────────────────── */
function ResourceCard({ r, currentUser, getGroup, getGroupName, toggleLike, togglePinResource, onDelete, isPinned }) {
  const [copied, setCopied] = useState(false);
  const m      = typeMeta(r.type);
  const group  = getGroup(r.groupId);
  const isFile = ['PDF', 'Document', 'Notes'].includes(r.type);
  const fileUrl= r.fileUrl ? `http://localhost:5000${r.fileUrl}` : null;
  const linkUrl= r.url || fileUrl;
  const isOwner= r.authorId === currentUser?._id;

  const handleCopy = () => {
    if (!linkUrl) return;
    navigator.clipboard.writeText(linkUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleOpen = () => {
    if (linkUrl) window.open(linkUrl, '_blank', 'noopener');
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = r.fileName || r.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{
      background: '#fff', borderRadius: '1.5rem', padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column',
      border: isPinned ? '1.5px solid #a5b4fc' : '1.5px solid transparent',
      transition: 'all 0.2s', position: 'relative'
    }}
      onMouseEnter={e => { if (!isPinned) e.currentTarget.style.borderColor = '#e0e3e5'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { if (!isPinned) e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>

      {/* Top row: icon + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {typeIcon(r.type)}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={() => togglePinResource(r.id)} title={r.pinned ? 'Unpin' : 'Pin'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: r.pinned ? '#6366f1' : '#c7c4d7', padding: '0.25rem' }}>
            <Bookmark size={14} style={{ fill: r.pinned ? '#6366f1' : 'none' }} />
          </button>
          {isOwner && (
            <button onClick={onDelete} title="Delete"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '0.25rem', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#fca5a5'}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Type + Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
        <span style={{ background: m.bg, color: m.color, fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>{m.label}</span>
        {r.tags?.slice(0, 2).map(t => (
          <span key={t} style={{ background: '#f2f4f6', color: '#767586', fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>
        ))}
      </div>

      {/* Title */}
      <h4 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#191c1e', marginBottom: '0.375rem', lineHeight: 1.3 }}>{r.title}</h4>

      {/* Description */}
      {r.description && (
        <p style={{ fontSize: '0.75rem', color: '#767586', lineHeight: 1.5, marginBottom: '0.625rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</p>
      )}

      {/* File name for uploaded files */}
      {r.fileName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#f7f9fb', borderRadius: '0.5rem', padding: '0.375rem 0.625rem', marginBottom: '0.625rem' }}>
          <File size={12} style={{ color: '#767586', flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: '#767586', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.fileName}</span>
        </div>
      )}

      {/* Group badge */}
      {group && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
          <Users size={11} style={{ color: '#a5b4fc' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{group.name}</span>
          {group.topic && <span style={{ fontSize: '0.65rem', color: '#767586' }}>· {group.topic}</span>}
        </div>
      )}

      {/* Author + time */}
      <div style={{ fontSize: '0.7rem', color: '#767586', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 600, color: '#191c1e' }}>{r.author}</span> · {timeAgo(r.createdAt || r.uploadedAt)}
      </div>

      {/* Bottom actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f2f4f6', paddingTop: '0.75rem', marginTop: 'auto', gap: '0.375rem' }}>
        {/* Like */}
        <button onClick={() => toggleLike(r.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: r.likedByUser ? '#ef4444' : '#767586', fontSize: '0.78rem', fontWeight: 600 }}>
          <Heart size={14} style={{ fill: r.likedByUser ? '#ef4444' : 'none', transition: 'all 0.2s' }} /> {r.likes || 0}
        </button>

        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {/* Copy link */}
          {linkUrl && (
            <button onClick={handleCopy} title="Copy link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f2f4f6', border: 'none', cursor: 'pointer', color: copied ? '#10b981' : '#767586', fontSize: '0.7rem', fontWeight: 600, padding: '0.3rem 0.625rem', borderRadius: '999px', transition: 'all 0.2s' }}>
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}

          {/* Open link (for Link/Video) */}
          {!isFile && linkUrl && (
            <button onClick={handleOpen} title="Open link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.625rem', borderRadius: '999px' }}>
              <ExternalLink size={12} /> Open
            </button>
          )}

          {/* Download (for uploaded files) */}
          {isFile && fileUrl && (
            <button onClick={handleDownload} title="Download"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.625rem', borderRadius: '999px' }}>
              <Download size={12} /> Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const selS = { padding: '0.4rem 0.875rem', borderRadius: '999px', border: '1px solid #e0e3e5', fontSize: '0.78rem', fontWeight: 600, color: '#464554', background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif' };

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Plus, RefreshCw, Pin, Trash2, X, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CreateGroupModal from '../components/CreateGroupModal';
import ConfirmDialog from '../components/ConfirmDialog';
import './GroupList.css';

export default function GroupList() {
  const navigate = useNavigate();
  const { groups, deleteGroup, togglePinGroup, topics, semesters } = useApp();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [semester, setSemester] = useState('All');
  const [sort, setSort] = useState('recent');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = () => setOpenDropdown(null);
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filtered = groups
    .filter(g => {
      const q = query.toLowerCase();
      const matchQ = !q || g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q));
      const matchT = topic === 'All' || g.topic === topic;
      const matchS = semester === 'All' || g.semester === semester;
      return matchQ && matchT && matchS;
    })
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.recentActivity) - new Date(a.recentActivity);
      if (sort === 'popular') return b.members - a.members;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const pinned = filtered.filter(g => g.pinned);
  const rest = filtered.filter(g => !g.pinned);

  return (
    <div className="group-list-container">
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eef2ff', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>COMMUNITY</span>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>Study Groups</h1>
          <p style={{ color: '#767586', fontSize: '0.875rem' }}>Join high-performance learning clusters and share resources.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f2f4f6', borderRadius: '999px', padding: '0.5rem 1rem', width: '220px' }}>
            <Search size={15} style={{ color: '#767586', flexShrink: 0 }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search groups…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: '#191c1e', width: '100%', fontFamily: 'Inter, sans-serif' }} />
            {query && <X size={14} style={{ color: '#767586', cursor: 'pointer', flexShrink: 0 }} onClick={() => setQuery('')} />}
          </div>
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', whiteSpace: 'nowrap' }}>
            <Plus size={16} /> New Group
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '2rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#767586', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><SlidersHorizontal size={14} /> Filters:</span>
        {[
          { label: 'Topic', value: topic, options: ['All', ...topics], setter: setTopic, key: 'topic' },
          { label: 'Semester', value: semester, options: ['All', ...semesters], setter: setSemester, key: 'sem' },
          { label: 'Sort', value: sort, options: [{ v: 'recent', l: 'Recent' }, { v: 'popular', l: 'Popular' }, { v: 'name', l: 'A–Z' }], setter: setSort, key: 'sort', isSort: true },
        ].map(f => (
          <DropPill key={f.key} {...f} open={openDropdown === f.key} onOpen={() => setOpenDropdown(openDropdown === f.key ? null : f.key)} />
        ))}
        {(topic !== 'All' || semester !== 'All' || query) && (
          <button onClick={() => { setTopic('All'); setSemester('All'); setQuery(''); }} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', border: 'none', borderRadius: '999px', padding: '0.375rem 0.875rem', cursor: 'pointer' }}>Clear All</button>
        )}
      </div>

      {/* Pinned Groups */}
      {pinned.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Pin size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586' }}>Pinned</span>
          </div>
          <div className="groups-grid">
            {pinned.map(g => <GroupCard key={g.id} group={g} onOpen={() => navigate(`/app/groups/${g.id}`)} onPin={() => togglePinGroup(g.id)} onDelete={() => setDeleteTarget(g)} pinned />)}
          </div>
        </div>
      )}

      {/* All Groups */}
      <div className="groups-grid">
        {rest.map(g => (
          <GroupCard key={g.id} group={g} onOpen={() => navigate(`/app/groups/${g.id}`)} onPin={() => togglePinGroup(g.id)} onDelete={() => setDeleteTarget(g)} />
        ))}

        {/* Create Card */}
        <div className="group-card create-cluster-card" onClick={() => setShowCreate(true)} style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '2px dashed #c7c4d7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#767586', marginBottom: '1rem' }}>
            <Plus size={20} />
          </div>
          <h3 style={{ fontWeight: 700, color: '#191c1e', marginBottom: '0.375rem', fontFamily: 'Manrope, sans-serif' }}>Start a Cluster</h3>
          <p style={{ fontSize: '0.78rem', color: '#767586', maxWidth: '160px' }}>Can't find your topic? Build your own community.</p>
        </div>

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: '#767586' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 700, color: '#191c1e', marginBottom: '0.375rem' }}>No groups found</h3>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Group"
          message={`Are you sure you want to delete "${deleteTarget.name}"? All resources and messages will be permanently removed.`}
          onConfirm={() => { deleteGroup(deleteTarget.id, deleteTarget.name); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ─── Group Card ─────────────────────────────────────────────────────────── */
function GroupCard({ group, onOpen, onPin, onDelete, pinned }) {
  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="group-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Top actions (show on hover via CSS) */}
      <div className="group-card-actions">
        <button title={pinned ? 'Unpin' : 'Pin'} onClick={e => { e.stopPropagation(); onPin(); }} style={{ ...actBtn, color: pinned ? '#f59e0b' : '#767586' }}><Pin size={13} /></button>
        <button title="Delete" onClick={e => { e.stopPropagation(); onDelete(); }} style={{ ...actBtn, color: '#ef4444' }}><Trash2 size={13} /></button>
      </div>

      <div className="group-card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#eef2ff,#ddd6fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#6366f1', fontFamily: 'Manrope, sans-serif' }}>
          {group.name.charAt(0)}
        </div>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, background: '#eef2ff', color: '#6366f1', padding: '0.2rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase' }}>{group.semester}</span>
      </div>

      <div onClick={onOpen} style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e', marginBottom: '0.375rem', lineHeight: 1.3 }}>{group.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#767586', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{group.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
          {group.tags.map(t => <span key={t} style={{ background: '#f2f4f6', color: '#464554', fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>{t}</span>)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f2f4f6', paddingTop: '0.875rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2].map(i => (
                <img key={i} src={`https://ui-avatars.com/api/?name=U${i}+${group.id}&background=random&size=24`} style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #fff', marginLeft: i > 1 ? '-6px' : 0 }} alt="m" />
              ))}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#767586' }}>+{group.members}</span>
          </div>
          <span style={{ fontSize: '0.65rem', color: '#767586' }}>{timeAgo(group.recentActivity)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Dropdown Pill ──────────────────────────────────────────────────────── */
function DropPill({ label, value, options, setter, open, onOpen, isSort }) {
  const display = isSort ? (options.find(o => o.v === value)?.l || value) : value;
  return (
    <div style={{ position: 'relative' }} onMouseDown={e => e.stopPropagation()}>
      <button onClick={onOpen} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: open ? '#eef2ff' : '#fff', border: '1px solid ' + (open ? '#a5b4fc' : '#e0e3e5'), borderRadius: '999px', padding: '0.4rem 0.875rem', fontSize: '0.78rem', fontWeight: 600, color: open ? '#6366f1' : '#464554', cursor: 'pointer', whiteSpace: 'nowrap' }}>
        {label}: <span style={{ color: '#6366f1' }}>{display}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s', color: '#6366f1' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#fff', border: '1px solid #e0e3e5', borderRadius: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '0.375rem', zIndex: 100, minWidth: '160px', maxHeight: '220px', overflowY: 'auto' }}>
          {options.map(o => {
            const v = isSort ? o.v : o;
            const l = isSort ? o.l : o;
            const active = value === v;
            return (
              <button key={v} onClick={() => { setter(v); onOpen(); }} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '0.5rem', background: active ? '#eef2ff' : 'transparent', color: active ? '#6366f1' : '#191c1e', fontSize: '0.82rem', fontWeight: active ? 700 : 400, cursor: 'pointer', display: 'block' }}>
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const actBtn = { background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e3e5', borderRadius: '0.5rem', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' };

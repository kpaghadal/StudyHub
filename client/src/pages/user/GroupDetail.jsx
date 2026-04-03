import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Plus, FileText, Video, Link as LinkIcon, Download, Heart, MessageSquare, Send, Users, TrendingUp, Bookmark, Trash2, Edit2, Pin, MoreVertical, Award, ShieldCheck, ExternalLink, Search, X, Filter } from 'lucide-react';
import AddResourceModal from '../../components/AddResourceModal';
import EditGroupModal from '../../components/EditGroupModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import './GroupDetail.css';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, resources, messages, deleteGroup, toggleLike, togglePinResource, deleteResource, sendMessage, currentUser, joinGroup, fetchMessagesForGroup } = useApp();
  const [tab, setTab] = useState('resources');
  const [showAddRes, setShowAddRes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState(false);
  const [deleteResConfirm, setDeleteResConfirm] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('All');
  const chatEnd = useRef(null);

  const group = groups.find(g => g.id === id);
  const groupResources = resources.filter(r => r.groupId === id).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  });

  const resourceTypes = ['All', ...Array.from(new Set(groupResources.map(r => r.type).filter(Boolean)))];

  const filteredResources = groupResources.filter(r => {
    const q = resourceSearch.toLowerCase();
    const matchesSearch = !q ||
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.author?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q));
    const matchesType = resourceFilter === 'All' || r.type === resourceFilter;
    return matchesSearch && matchesType;
  });
  
  const topContributors = (() => {
    const counts = {};
    groupResources.forEach(r => {
      const author = r.author || 'Unknown';
      if (!counts[author]) counts[author] = 0;
      counts[author]++;
    });
    return Object.entries(counts)
      .map(([n, c]) => ({ n, c }))
      .sort((a, b) => b.c - a.c)
      .slice(0, 3)
      .map((item, i) => ({
        ...item,
        medal: i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'
      }));
  })();
  
  const groupMessages = [...messages.filter(m => m.groupId === id)];

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [groupMessages.length]);
  
  useEffect(() => {
    if (tab === 'discussion' && id) {
      fetchMessagesForGroup(id);
    }
  }, [tab, id, fetchMessagesForGroup]);

  if (!group) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>😕</div>
      <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#191c1e' }}>Group Not Found</h2>
      <button onClick={() => navigate('/app/groups')} style={{ padding: '0.625rem 1.5rem', borderRadius: '999px', background: '#eef2ff', color: '#6366f1', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Back to Groups</button>
    </div>
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    sendMessage(group.id, msgText.trim());
    setMsgText('');
  };

  const typeIcon = (type) => {
    const map = { PDF: <FileText size={18} />, Video: <Video size={18} />, Link: <LinkIcon size={18} />, Notes: <FileText size={18} /> };
    return map[type] || <FileText size={18} />;
  };

  const timeAgo = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d} days ago`;
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca, #7c3aed)', borderRadius: '1.75rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.4) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Top actions */}
        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/app/groups')} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><ArrowLeft size={18} /></button>
        </div>
        {group.creator === currentUser?._id && (
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowEdit(true)} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Edit2 size={15} /></button>
            <button onClick={() => setDeleteGroupConfirm(true)} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Trash2 size={15} /></button>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>{group.topic}</span>
            <span style={{ background: '#6366f1', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase' }}>{group.semester}</span>
          </div>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.5rem)', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.15 }}>{group.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', maxWidth: '600px', lineHeight: 1.6 }}>{group.description}</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Users size={13} /> {group.memberCount} members</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>📚 {groupResources.length} resources</span>
          </div>
        </div>
      </div>

      {!group.joined && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>You are exploring as a guest</h3>
            <p style={{ color: '#991b1b', fontSize: '0.8rem' }}>Join this group to upload resources and participate in the discussion.</p>
          </div>
          <button onClick={() => joinGroup(group.id)} style={{ background: '#dc2626', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>Join Group</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f2f4f6', marginBottom: '1.75rem', overflowX: 'auto' }}>
        {[
          { id: 'resources', label: 'Resources', icon: <FolderIcon /> },
          { id: 'members', label: `Members (${group.memberCount})`, icon: <Users size={15} /> },
          { id: 'discussion', label: 'Discussion', icon: <MessageSquare size={15} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.875rem 1.5rem', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#6366f1' : 'transparent'}`, background: 'transparent', color: tab === t.id ? '#6366f1' : '#767586', fontWeight: tab === t.id ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="detail-grid">

        {/* Access Control Check for Non-Members */}
        {!group.joined ? (
          <div style={{ 
            background: '#fff', 
            borderRadius: '2.5rem', 
            padding: '5rem 2rem', 
            textAlign: 'center', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            border: '1px solid #f2f4f6',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '2.5rem', 
              background: '#fef2f2', 
              color: '#ef4444', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2rem',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', inset: -8, border: '2px dashed #fecaca', borderRadius: '3rem', animation: 'spin 15s linear infinite' }}></div>
              <ShieldCheck size={48} />
            </div>
            
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#191c1e', marginBottom: '1rem', fontFamily: 'Manrope, sans-serif' }}>Membership Required</h2>
            <p style={{ color: '#767586', maxWidth: '420px', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              The <strong>{tab}</strong> for <strong>{group.name}</strong> are exclusively available to community members. Join the group to access all shared learning assets!
            </p>
            
            <button 
              onClick={() => joinGroup(group.id)} 
              style={{ 
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                color: '#fff', 
                padding: '1.125rem 3rem', 
                borderRadius: '999px', 
                fontWeight: 800, 
                fontSize: '1.1rem', 
                border: 'none', 
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(79, 70, 229, 0.3)';
              }}
            >
              <Users size={20} /> Request Access & Join
            </button>

            <style>{`
              @keyframes spin { from {transform:rotate(0deg);} to {transform:rotate(360deg);} }
              @keyframes fadeIn { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }
            `}</style>
          </div>
        ) : (
          <>
            {/* ── Resources Tab ── */}
            {tab === 'resources' && (
              <>
                <div>
                  {/* Search & Filter Bar */}
                  {groupResources.length > 0 && (
                    <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Search Input */}
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                        <input
                          id="resource-search"
                          type="text"
                          value={resourceSearch}
                          onChange={e => setResourceSearch(e.target.value)}
                          placeholder="Search resources by title, tag, author…"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            paddingLeft: '2.75rem',
                            paddingRight: resourceSearch ? '2.75rem' : '1rem',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem',
                            background: '#fff',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontFamily: 'Inter, sans-serif',
                            color: '#191c1e',
                            outline: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                          }}
                          onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                        />
                        {resourceSearch && (
                          <button
                            onClick={() => setResourceSearch('')}
                            style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: '#f2f4f6', border: 'none', borderRadius: '50%', width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#767586' }}
                          >
                            <X size={11} />
                          </button>
                        )}
                      </div>

                      {/* Type Filter Chips */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Filter size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
                        {resourceTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => setResourceFilter(type)}
                            style={{
                              padding: '0.3rem 0.875rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              border: '1.5px solid',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              borderColor: resourceFilter === type ? '#6366f1' : '#e5e7eb',
                              background: resourceFilter === type ? '#eef2ff' : '#fff',
                              color: resourceFilter === type ? '#6366f1' : '#767586'
                            }}
                          >
                            {type}
                          </button>
                        ))}
                        {(resourceSearch || resourceFilter !== 'All') && (
                          <button
                            onClick={() => { setResourceSearch(''); setResourceFilter('All'); }}
                            style={{ padding: '0.3rem 0.875rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <X size={10} /> Clear
                          </button>
                        )}
                      </div>

                      {/* Result count hint */}
                      {(resourceSearch || resourceFilter !== 'All') && (
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.25rem' }}>
                          Showing <strong style={{ color: '#6366f1' }}>{filteredResources.length}</strong> of {groupResources.length} resources
                        </p>
                      )}
                    </div>
                  )}

                  {groupResources.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                      <h3 style={{ fontWeight: 700, color: '#191c1e', marginBottom: '0.375rem' }}>No resources yet</h3>
                      <p style={{ fontSize: '0.875rem', color: '#767586', marginBottom: '1.5rem' }}>Be the first to share a resource with this group!</p>
                      <button onClick={() => setShowAddRes(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Resource</button>
                    </div>
                  ) : filteredResources.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                      <h3 style={{ fontWeight: 700, color: '#191c1e', marginBottom: '0.375rem' }}>No results found</h3>
                      <p style={{ fontSize: '0.875rem', color: '#767586', marginBottom: '1rem' }}>Try a different keyword or clear your filters.</p>
                      <button onClick={() => { setResourceSearch(''); setResourceFilter('All'); }} style={{ background: '#eef2ff', color: '#6366f1', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '999px', border: 'none', cursor: 'pointer', fontSize: '0.825rem' }}>Clear Filters</button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', position: 'relative' }}>
                      {filteredResources.map(res => {
                        const fileUrl = res.fileUrl ? (res.fileUrl.startsWith('http') ? res.fileUrl : `http://localhost:5000/${res.fileUrl.replace(/\\/g, '/')}`) : null;
                        const linkUrl = res.url || fileUrl;
                        const handleDownload = async (e) => {
                          e.stopPropagation();
                          if (!fileUrl) return;

                          const a = document.createElement('a');
                          a.href = fileUrl;
                          a.target = '_blank';
                          a.download = res.fileName || res.title || 'download';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        };

                        return (
                        <div key={res.id} onClick={() => navigate(`/app/resources/${res.id}`)} style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative', border: res.pinned ? '1px solid #a5b4fc' : '1px solid transparent', transition: 'all 0.2s', animation: 'fadeIn 0.3s ease-out', cursor: 'pointer' }}>
                          {res.pinned && <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', color: '#6366f1' }}><Pin size={12} /></div>}
                          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                            <button onClick={(e) => { e.stopPropagation(); togglePinResource(res.id); }} title="Pin" style={{ ...rBtn, color: res.pinned ? '#6366f1' : '#767586' }}><Bookmark size={12} /></button>
                            {(res.authorId === currentUser?._id || group.creator === currentUser?._id) && (
                              <button onClick={(e) => { e.stopPropagation(); setDeleteResConfirm(res); }} title="Delete" style={{ ...rBtn, color: '#ef4444' }}><Trash2 size={12} /></button>
                            )}
                          </div>

                          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '0.875rem' }}>
                            {typeIcon(res.type)}
                          </div>
                          <h4 style={{ fontWeight: 700, color: '#191c1e', fontSize: '0.92rem', lineHeight: 1.3, marginBottom: '0.375rem', paddingRight: '2.5rem' }}>{res.title}</h4>
                          {res.description && <p style={{ fontSize: '0.75rem', color: '#767586', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{res.description}</p>}
                          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                            <span style={{ background: '#f2f4f6', color: '#464554', fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>{res.type}</span>
                            {res.tags?.map(t => <span key={t} style={{ background: '#eef2ff', color: '#6366f1', fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
                          </div>
                          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f2f4f6', paddingTop: '0.75rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#767586' }}>{res.author} · {timeAgo(res.uploadedAt)}</span>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <button onClick={(e) => { e.stopPropagation(); toggleLike(res.id); }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: res.likedByUser ? '#ef4444' : '#767586', fontSize: '0.72rem', fontWeight: 600 }}>
                                <Heart size={13} style={{ fill: res.likedByUser ? '#ef4444' : 'none' }} /> {res.likes || 0}
                              </button>
                              {['PDF', 'Document', 'Notes'].includes(res.type) && fileUrl && (
                                <button onClick={handleDownload} title="Download" style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}><Download size={13} /></button>
                              )}
                              {['Link', 'Video'].includes(res.type) && linkUrl && (
                                <button onClick={(e) => { e.stopPropagation(); window.open(linkUrl, '_blank', 'noopener'); }} title="Open" style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}><ExternalLink size={13} /></button>
                              )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Activity Stats */}
                  {groupResources.length > 0 && (
                    <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '1.5rem', padding: '1.75rem 2rem', marginTop: '1.5rem', color: '#fff', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Activity Insights</h3>
                        <p style={{ fontSize: '0.82rem', opacity: 0.8, maxWidth: '320px', lineHeight: 1.6 }}>This group has grown by 40% in resource sharing this month.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '2rem' }}>
                        {[{ v: `${groupResources.reduce((s, r) => s + r.likes, 0)}`, l: 'Likes' }, { v: groupResources.length, l: 'Resources' }, { v: `#${Math.max(1, 5 - Math.floor(groupResources.length / 2))}`, l: 'Rank' }].map(s => (
                          <div key={s.l} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>{s.v}</p>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar - Top Contributors */}
                <div className="detail-sidebar">
                  <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={16} style={{ color: '#f59e0b' }} /> Top Contributors</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {topContributors.length > 0 ? topContributors.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: '0.875rem', background: '#f7f9fb' }}>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.n)}&background=random&size=36`} style={{ width: 36, height: 36, borderRadius: '50%' }} alt={c.n} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#191c1e', marginBottom: '0.1rem' }}>{c.medal} {c.n}</p>
                            <p style={{ fontSize: '0.7rem', color: '#767586' }}>{c.c} resource{c.c !== 1 ? 's' : ''} shared</p>
                          </div>
                        </div>
                      )) : (
                        <p style={{ fontSize: '0.8rem', color: '#767586', textAlign: 'center', padding: '1rem' }}>No contributors yet</p>
                      )}
                    </div>
                    {group.joined && (
                      <button onClick={() => setShowAddRes(true)} style={{ width: '100%', marginTop: '1rem', padding: '0.625rem', borderRadius: '999px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Plus size={15} /> Add Resource
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Members Tab ── */}
            {tab === 'members' && (
              <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, marginBottom: '1.25rem' }}>Group Members ({group.memberCount})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {(group.members || []).map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid #f2f4f6', transition: 'all 0.15s' }}>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'Scholar')}&background=random&size=40`} style={{ width: 40, height: 40, borderRadius: '50%' }} alt={m.name} />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#191c1e' }}>{m.name || 'Scholar'}</p>
                        <p style={{ fontSize: '0.72rem', color: '#767586' }}>{group.topic} · Member</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Discussion Tab ── */}
            {tab === 'discussion' && (
              <div style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '560px', animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f2f4f6' }}>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e' }}>Group Discussion</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {groupMessages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isCurrentUser ? 'flex-end' : 'flex-start', gap: '0.625rem', alignItems: 'flex-end' }}>
                      {!msg.isCurrentUser && !msg.isSystem && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#6366f1', flexShrink: 0 }}>{msg.avatar}</div>
                      )}
                      {msg.isSystem ? (
                        <div style={{ width: '100%', textAlign: 'center', fontSize: '0.72rem', color: '#767586', fontStyle: 'italic', background: '#f7f9fb', padding: '0.375rem 0.75rem', borderRadius: '999px' }}>{msg.text}</div>
                      ) : (
                        <div style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: '1rem', background: msg.isCurrentUser ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f2f4f6', borderBottomRightRadius: msg.isCurrentUser ? '0.25rem' : '1rem', borderBottomLeftRadius: msg.isCurrentUser ? '1rem' : '0.25rem' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: msg.isCurrentUser ? 'rgba(255,255,255,0.9)' : '#6366f1', marginBottom: '0.25rem' }}>{msg.sender}</div>
                          <p style={{ fontSize: '0.875rem', color: msg.isCurrentUser ? '#fff' : '#191c1e', lineHeight: 1.5 }}>{msg.text}</p>
                          <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', color: msg.isCurrentUser ? 'rgba(255,255,255,0.6)' : '#767586', textAlign: msg.isCurrentUser ? 'right' : 'left' }}>{msg.timestamp}</div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEnd} />
                </div>
                <form onSubmit={handleSend} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f2f4f6', display: 'flex', gap: '0.625rem' }}>
                  <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message…" style={{ flex: 1, background: '#f7f9fb', border: '1px solid #e0e3e5', borderRadius: '999px', padding: '0.625rem 1rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', outline: 'none', color: '#191c1e' }} />
                  <button type="submit" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}><Send size={15} /></button>
                </form>
              </div>
            )}
          </>
        )}
      </div>


      {/* Floating Add Button */}
      {tab === 'resources' && group.joined && (
        <button onClick={() => setShowAddRes(true)} style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40, transition: 'transform 0.2s' }}>
          <Plus size={22} />
        </button>
      )}

      {showAddRes && <AddResourceModal onClose={() => setShowAddRes(false)} groupId={group.id} />}
      {showEdit && <EditGroupModal group={group} onClose={() => setShowEdit(false)} />}
      {deleteGroupConfirm && (
        <ConfirmDialog title="Delete Group" message={`Delete "${group.name}"? All resources and messages will be lost.`}
          onConfirm={() => { deleteGroup(group.id, group.name); navigate('/app/groups'); }}
          onCancel={() => setDeleteGroupConfirm(false)} />
      )}
      {deleteResConfirm && (
        <ConfirmDialog title="Delete Resource" message={`Remove "${deleteResConfirm.title}" from this group?`}
          onConfirm={() => { deleteResource(deleteResConfirm.id); setDeleteResConfirm(null); }}
          onCancel={() => setDeleteResConfirm(null)} />
      )}
    </div>
  );
}

const FolderIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;

const rBtn = { background: 'rgba(242,244,246,0.9)', border: 'none', borderRadius: '0.375rem', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

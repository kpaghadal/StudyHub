import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, FileText, Video, Link as LinkIcon, Download, Heart, MessageSquare, Send, Users, TrendingUp, Bookmark, Trash2, Edit2, Pin, MoreVertical, Award } from 'lucide-react';
import AddResourceModal from '../components/AddResourceModal';
import EditGroupModal from '../components/EditGroupModal';
import ConfirmDialog from '../components/ConfirmDialog';
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
  const chatEnd = useRef(null);

  const group = groups.find(g => g.id === id);
  const groupResources = resources.filter(r => r.groupId === id).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  });
  
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

        {/* ── Resources Tab ── */}
        {tab === 'resources' && (
          <>
            <div>
              {groupResources.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                  <h3 style={{ fontWeight: 700, color: '#191c1e', marginBottom: '0.375rem' }}>No resources yet</h3>
                  <p style={{ fontSize: '0.875rem', color: '#767586', marginBottom: '1.5rem' }}>Be the first to share a resource with this group!</p>
                  {group.joined ? (
                    <button onClick={() => setShowAddRes(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Resource</button>
                  ) : (
                    <button onClick={() => joinGroup(group.id)} style={{ background: '#f2f4f6', color: '#767586', fontWeight: 700, padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer' }}>Join to Add</button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', position: 'relative' }}>
                  {groupResources.map(res => (
                    <div key={res.id} style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative', border: res.pinned ? '1px solid #a5b4fc' : '1px solid transparent', transition: 'all 0.2s' }}>
                      {res.pinned && <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', color: '#6366f1' }}><Pin size={12} /></div>}
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                        <button onClick={() => togglePinResource(res.id)} title="Pin" style={{ ...rBtn, color: res.pinned ? '#6366f1' : '#767586' }}><Bookmark size={12} /></button>
                        {(res.authorId === currentUser?._id || group.creator === currentUser?._id) && (
                          <button onClick={() => setDeleteResConfirm(res)} title="Delete" style={{ ...rBtn, color: '#ef4444' }}><Trash2 size={12} /></button>
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
                          <button onClick={() => toggleLike(res.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: res.likedByUser ? '#ef4444' : '#767586', fontSize: '0.72rem', fontWeight: 600 }}>
                            <Heart size={13} style={{ fill: res.likedByUser ? '#ef4444' : 'none' }} /> {res.likes}
                          </button>
                          <button style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#767586' }}><Download size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {[{ n: 'Dr. Elias Thorne', c: 24, medal: '🥇' }, { n: 'Sarah Jenkins', c: 18, medal: '🥈' }, { n: 'Rahul Shah', c: 11, medal: '🥉' }].map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: '0.875rem', background: '#f7f9fb' }}>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.n)}&background=random&size=36`} style={{ width: 36, height: 36, borderRadius: '50%' }} alt={c.n} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#191c1e', marginBottom: '0.1rem' }}>{c.medal} {c.n}</p>
                        <p style={{ fontSize: '0.7rem', color: '#767586' }}>{c.c} resources shared</p>
                      </div>
                    </div>
                  ))}
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
          <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
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
          <div style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '560px' }}>
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
            {group.joined ? (
              <form onSubmit={handleSend} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f2f4f6', display: 'flex', gap: '0.625rem' }}>
                <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message…" style={{ flex: 1, background: '#f7f9fb', border: '1px solid #e0e3e5', borderRadius: '999px', padding: '0.625rem 1rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', outline: 'none', color: '#191c1e' }} />
                <button type="submit" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}><Send size={15} /></button>
              </form>
            ) : (
              <div style={{ padding: '1rem', background: '#fef2f2', textAlign: 'center', borderTop: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>
                You must join this group to send messages.
              </div>
            )}
          </div>
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

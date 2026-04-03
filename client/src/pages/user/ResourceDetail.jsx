import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, FileText, Video, Link as LinkIcon, Heart, Download, Bookmark, Trash2, Copy, ExternalLink, CheckCheck, Users, Clock, File } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';

const TYPE_META = {
  PDF:      { bg: '#eef2ff', color: '#6366f1',  label: 'PDF' },
  Document: { bg: '#f3f0ff', color: '#8b5cf6',  label: 'Document' },
  Notes:    { bg: '#fdf4ff', color: '#a855f7',  label: 'Notes' },
  Video:    { bg: '#fff7ed', color: '#f59e0b',  label: 'Video' },
  Link:     { bg: '#f0fdf4', color: '#10b981',  label: 'Link' },
};

const typeIcon  = (type, size = 24) => {
  if (type === 'Video') return <Video size={size} />;
  if (type === 'Link')  return <LinkIcon size={size} />;
  if (type === 'Document') return <File size={size} />;
  return <FileText size={size} />;
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resources, groups, currentUser, toggleLike, togglePinResource, deleteResource } = useApp();
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const resource = resources.find(r => r.id === id);
  if (!resource) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Resource Not Found</h2>
        <button onClick={() => navigate('/app/resources')} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const group = groups.find(g => g.id === resource.groupId);
  const m = TYPE_META[resource.type] || TYPE_META.PDF;
  const isFile = ['PDF', 'Document', 'Notes'].includes(resource.type);
  const fileUrl = resource.fileUrl ? (resource.fileUrl.startsWith('http') ? resource.fileUrl : `http://localhost:5000/${resource.fileUrl.replace(/\\/g, '/')}`) : null;
  const linkUrl = resource.url || fileUrl;
  const isOwner = resource.authorId === currentUser?._id;

  const handleCopy = () => {
    if (!linkUrl) return;
    navigator.clipboard.writeText(linkUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleOpen = () => {
    if (linkUrl) window.open(linkUrl, '_blank', 'noopener');
  };

  const handleDownload = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!fileUrl) return;

    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.download = resource.fileName || resource.title || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = () => {
    deleteResource(resource.id);
    navigate(-1); // go back
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {typeIcon(resource.type, 32)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => togglePinResource(resource.id)} title={resource.pinned ? 'Unpin' : 'Pin'} style={{ background: '#f8fafc', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: resource.pinned ? '#6366f1' : '#94a3b8', transition: 'all 0.2s' }}>
              <Bookmark size={18} style={{ fill: resource.pinned ? '#6366f1' : 'none' }} />
            </button>
            {isOwner && (
              <button onClick={() => setDeleteConfirm(true)} title="Delete" style={{ background: '#fef2f2', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s' }}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ background: m.bg, color: m.color, fontSize: '0.7rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase' }}>{m.label}</span>
          {resource.tags?.map(t => (
            <span key={t} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{t}</span>
          ))}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', fontFamily: 'Manrope, sans-serif', lineHeight: 1.2 }}>{resource.title}</h1>
        
        {resource.description ? (
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>{resource.description}</p>
        ) : (
          <p style={{ fontSize: '1rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '2rem' }}>No description provided.</p>
        )}

        {resource.fileName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <File size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>{resource.fileName}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Author</span>
            <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{resource.author || 'Scholar'}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Date Uploaded</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}><Clock size={14} /> {new Date(resource.createdAt || resource.uploadedAt).toLocaleDateString()}</span>
          </div>
          {group && (
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
               <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Shared In Group</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                 <Users size={16} color="#6366f1" />
                 <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{group.name}</span>
               </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', borderTop: '2px dashed #f1f5f9', paddingTop: '1.5rem' }}>
          <button onClick={() => toggleLike(resource.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: resource.likedByUser ? '#fef2f2' : '#f8fafc', border: `1px solid ${resource.likedByUser ? '#fecaca' : '#e2e8f0'}`, cursor: 'pointer', color: resource.likedByUser ? '#ef4444' : '#64748b', fontSize: '0.9rem', fontWeight: 700, padding: '0.7rem 1.2rem', borderRadius: '999px', transition: 'all 0.2s' }}>
            <Heart size={16} style={{ fill: resource.likedByUser ? '#ef4444' : 'none' }} /> {resource.likes || 0} Likes
          </button>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            {linkUrl && (
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '2px solid #e2e8f0', cursor: 'pointer', color: copied ? '#10b981' : '#475569', fontSize: '0.9rem', fontWeight: 700, padding: '0.7rem 1.2rem', borderRadius: '999px', transition: 'all 0.2s' }}>
                {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            )}

            {!isFile && linkUrl && (
              <button onClick={handleOpen} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#10b981', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', fontWeight: 700, padding: '0.7rem 1.2rem', borderRadius: '999px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <ExternalLink size={16} /> Open Link
              </button>
            )}

            {isFile && fileUrl && (
              <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#6366f1', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', fontWeight: 700, padding: '0.7rem 1.2rem', borderRadius: '999px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <Download size={16} /> Download File
              </button>
            )}
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <ConfirmDialog 
          title="Delete Resource" 
          message={`Are you sure you want to delete "${resource.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(false)} 
        />
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, FileText, Video, Plus, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TYPES = [
  { id: 'PDF',      label: 'PDF',      icon: FileText,  color: '#6366f1', bg: '#eef2ff', hasFile: true },
  { id: 'Document', label: 'Document', icon: File,      color: '#8b5cf6', bg: '#f3f0ff', hasFile: true },
  { id: 'Notes',    label: 'Notes',    icon: FileText,  color: '#a855f7', bg: '#fdf4ff', hasFile: true },
  { id: 'Link',     label: 'Link',     icon: LinkIcon,  color: '#10b981', bg: '#f0fdf4', hasFile: false },
  { id: 'Video',    label: 'Video',    icon: Video,     color: '#f59e0b', bg: '#fff7ed', hasFile: false },
];

const AddResourceModal = ({ onClose, groupId = null }) => {
  const { addResource, groups, currentUser } = useApp();
  const [type, setType] = useState('PDF');
  const [form, setForm] = useState({
    title: '', url: '', description: '', tagInput: '', tags: [], groupId: groupId ?? ''
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const current = TYPES.find(t => t.id === type);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'application/zip', 'application/x-zip-compressed'];

  const handleFile = (f) => {
    if (!f) return;
    
    if (!ALLOWED_TYPES.includes(f.type) && !f.name.endsWith('.zip')) {
      return alert(`Unsupported file type: ${f.name}`);
    }
    if (f.size > MAX_FILE_SIZE) {
      return alert(`File too large: ${f.name}. Max size is 5MB.`);
    }

    setFile(f);
    if (!form.title) {
      set('title', f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.groupId) return alert('Please select a group.');
    if (current.hasFile && !file) return alert('Please select a file to upload.');
    if (!current.hasFile && !form.url) return alert('Please enter a URL.');
    setLoading(true);
    try {
      await addResource({
        title: form.title,
        type,
        url: form.url,
        description: form.description,
        tags: form.tags,
        groupId: form.groupId,
        file: current.hasFile ? file : null,
      });
      onClose();
    } catch { }
    setLoading(false);
  };

  const addTag = () => {
    const t = form.tagInput.trim().toUpperCase();
    if (t && !form.tags.includes(t)) set('tags', form.tags.concat(t));
    set('tagInput', '');
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '1.75rem', width: '100%', maxWidth: '540px',
        padding: '2rem', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', animation: 'scaleIn 0.2s ease-out',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#191c1e' }}>Share a Resource</h2>
            <p style={{ fontSize: '0.78rem', color: '#767586', marginTop: '0.25rem' }}>Upload files or share links with your study group</p>
          </div>
          <button onClick={onClose} style={{ background: '#f2f4f6', border: 'none', cursor: 'pointer', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#767586' }}><X size={16} /></button>
        </div>

        {/* Type Selector */}
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {TYPES.map(t => {
            const Icon = t.icon;
            const active = type === t.id;
            return (
              <button key={t.id} type="button" onClick={() => { setType(t.id); setFile(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.875rem',
                  borderRadius: '999px', border: `1.5px solid ${active ? t.color : '#e0e3e5'}`,
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.15s',
                  background: active ? t.bg : '#fff', color: active ? t.color : '#767586'
                }}>
                <Icon size={13} />{t.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <F label="Resource Title">
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Chapter 3 Summary Notes" style={iS} />
          </F>

          {/* File Upload OR URL */}
          {current.hasFile ? (
            <F label="File Upload">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? current.color : file ? '#10b981' : '#c7c4d7'}`,
                  borderRadius: '0.875rem', padding: '1.5rem', textAlign: 'center',
                  cursor: 'pointer', background: dragOver ? current.bg : file ? '#f0fdf4' : '#fafafa',
                  transition: 'all 0.2s'
                }}>
                <input ref={fileRef} type="file" style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                  onChange={e => handleFile(e.target.files[0])} />
                {file ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                    <CheckCircle size={22} style={{ color: '#10b981' }} />
                    <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#191c1e', margin: 0 }}>{file.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#767586', margin: 0 }}>{formatBytes(file.size)} · Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={24} style={{ color: current.color, marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#464554' }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: '0.72rem', color: '#767586', marginTop: '0.25rem' }}>PDF, DOCX, JPG, PNG, ZIP — max 5MB</p>
                  </>
                )}
              </div>
            </F>
          ) : (
            <F label="URL">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', background: '#f7f9fb', border: '1px solid #e0e3e5', borderRadius: '0.625rem', overflow: 'hidden' }}>
                <span style={{ padding: '0 0.75rem', color: '#767586' }}><LinkIcon size={15} /></span>
                <input type="url" required value={form.url} onChange={e => set('url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any link"
                  style={{ ...iS, border: 'none', borderRadius: 0, background: 'transparent', flex: 1 }} />
              </div>
            </F>
          )}

          {/* Description */}
          <F label="Description (optional)">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What makes this resource helpful?" style={{ ...iS, height: '4rem', resize: 'none' }} />
          </F>

          {/* Group selector (only if not pre-set) */}
          {!groupId && (
            <F label="Group">
              <select required value={form.groupId} onChange={e => set('groupId', e.target.value)} style={{ ...iS, appearance: 'none' }}>
                <option value="">Select a group...</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </F>
          )}

          {/* Tags */}
          <F label="Tags (optional)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
              {form.tags.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#eef2ff', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                  {t} <X size={9} style={{ cursor: 'pointer' }} onClick={() => set('tags', form.tags.filter(x => x !== t))} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={form.tagInput} onChange={e => set('tagInput', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag & press Enter" style={{ ...iS, flex: 1 }} />
              <button type="button" onClick={addTag} style={{ background: '#eef2ff', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', padding: '0 0.75rem', color: '#6366f1', fontWeight: 600 }}><Plus size={14} /></button>
            </div>
          </F>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f2f4f6' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.625rem 1.25rem', borderRadius: '999px', border: '1px solid #e0e3e5', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: '#191c1e' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none',
              background: loading ? '#c7c4d7' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Uploading...</> : 'Share Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const F = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#767586', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>{label}</label>
    {children}
  </div>
);

const iS = { width: '100%', background: '#f7f9fb', border: '1px solid #e0e3e5', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', color: '#191c1e', outline: 'none', boxSizing: 'border-box' };

export default AddResourceModal;

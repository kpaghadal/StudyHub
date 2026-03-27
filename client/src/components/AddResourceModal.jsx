import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, FileText, Video, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TYPE_ICONS = { PDF: FileText, Video: Video, Link: LinkIcon, Notes: FileText };

const AddResourceModal = ({ onClose, groupId = null }) => {
  const { addResource, groups } = useApp();
  const [type, setType] = useState('PDF');
  const [form, setForm] = useState({ title: '', url: '', description: '', tagInput: '', tags: [], groupId: groupId ?? '' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    addResource({ title: form.title, url: form.url, description: form.description, tags: form.tags, type, groupId: parseInt(form.groupId), author: 'You', pinned: false });
    onClose();
  };
  const addTag = () => {
    const t = form.tagInput.trim().toUpperCase();
    if (t && !form.tags.includes(t)) set('tags', form.tags.concat(t));
    set('tagInput', '');
  };

  const types = ['PDF', 'Video', 'Link', 'Notes'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.14)', animation: 'scaleIn 0.2s ease-out' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#191c1e' }}>Share a Resource</h2>
            <p style={{ fontSize: '0.78rem', color: '#767586', marginTop: '0.2rem' }}>Contribute to your study group</p>
          </div>
          <button onClick={onClose} style={{ background: '#f2f4f6', border: 'none', cursor: 'pointer', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#767586' }}><X size={16} /></button>
        </div>

        {/* Type Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f7f9fb', padding: '0.25rem', borderRadius: '0.875rem' }}>
          {types.map(t => {
            const Icon = TYPE_ICONS[t];
            return (
              <button key={t} type="button" onClick={() => setType(t)}
                style={{ flex: 1, padding: '0.5rem 0.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s', background: type === t ? '#fff' : 'transparent', color: type === t ? '#6366f1' : '#767586', boxShadow: type === t ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}>
                <Icon size={14} />{t}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <F label="Title">
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Chapter 3 Summary Notes" style={iS} />
          </F>

          {type === 'PDF' || type === 'Notes' ? (
            <div style={{ border: '2px dashed #c7c4d7', borderRadius: '0.875rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
              <Upload size={22} style={{ color: '#6366f1', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.83rem', fontWeight: 600, color: '#464554' }}>Click to upload or drag & drop</p>
              <p style={{ fontSize: '0.72rem', color: '#767586', marginTop: '0.25rem' }}>PDF, DOCX, PPTX (max 10MB)</p>
            </div>
          ) : (
            <F label="URL">
              <input type="url" required value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://" style={iS} />
            </F>
          )}

          <F label="Description (optional)">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What makes this resource helpful?" style={{ ...iS, height: '4.5rem', resize: 'none' }} />
          </F>

          {!groupId && (
            <F label="Group">
              <select required value={form.groupId} onChange={e => set('groupId', e.target.value)} style={{ ...iS, appearance: 'none' }}>
                <option value="">Select a group...</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </F>
          )}

          <F label="Tags (optional)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
              {form.tags.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#eef2ff', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                  {t} <X size={9} style={{ cursor: 'pointer' }} onClick={() => set('tags', form.tags.filter(x => x !== t))} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={form.tagInput} onChange={e => set('tagInput', e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag & press Enter" style={{ ...iS, flex: 1 }} />
              <button type="button" onClick={addTag} style={{ background: '#eef2ff', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', padding: '0 0.75rem', color: '#6366f1', fontWeight: 600 }}><Plus size={14} /></button>
            </div>
          </F>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f2f4f6' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.625rem 1.25rem', borderRadius: '999px', border: '1px solid #e0e3e5', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: '#191c1e' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Share Resource</button>
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

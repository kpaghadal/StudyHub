import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EditGroupModal = ({ group, onClose }) => {
  const { updateGroup, topics, semesters } = useApp();
  const [formData, setFormData] = useState({ ...group, tagInput: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateGroup({ id: group.id, name: formData.name, topic: formData.topic, semester: formData.semester, description: formData.description, tags: formData.tags, pinned: formData.pinned });
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addTag = () => {
    const tag = formData.tagInput.trim().toUpperCase();
    if (tag && !formData.tags.includes(tag)) setFormData(p => ({ ...p, tags: [...p.tags, tag], tagInput: '' }));
  };

  const removeTag = (t) => setFormData(p => ({ ...p, tags: p.tags.filter(x => x !== t) }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '520px', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'scaleIn 0.2s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#191c1e' }}>Edit Group</h2>
          <button onClick={onClose} style={{ background: '#f2f4f6', border: 'none', cursor: 'pointer', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#767586' }}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Field label="Group Name">
            <input type="text" name="name" required value={formData.name} onChange={handleChange} style={iStyle} />
          </Field>
          <Field label="Description">
            <textarea name="description" required value={formData.description} onChange={handleChange} style={{ ...iStyle, height: '5.5rem', resize: 'none' }} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Topic">
              <select name="topic" value={formData.topic} onChange={handleChange} style={{ ...iStyle, appearance: 'none' }}>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Semester">
              <select name="semester" value={formData.semester} onChange={handleChange} style={{ ...iStyle, appearance: 'none' }}>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
              {formData.tags.map(tag => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#eef2ff', color: '#6366f1', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {tag} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input name="tagInput" placeholder="New tag" value={formData.tagInput} onChange={handleChange} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} style={{ ...iStyle, flex: 1 }} />
              <button type="button" onClick={addTag} style={{ background: '#f2f4f6', border: 'none', borderRadius: '0.5rem', padding: '0 0.75rem', cursor: 'pointer', fontWeight: 600 }}>Add</button>
            </div>
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f2f4f6' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.625rem 1.25rem', borderRadius: '999px', border: '1px solid #e0e3e5', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: '#191c1e' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.625rem 1.5rem', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#767586', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>{label}</label>
    {children}
  </div>
);

const iStyle = {
  width: '100%', background: '#f7f9fb', border: '1px solid #e0e3e5',
  borderRadius: '0.625rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
  fontFamily: 'Inter, sans-serif', color: '#191c1e', outline: 'none', boxSizing: 'border-box',
};

export default EditGroupModal;

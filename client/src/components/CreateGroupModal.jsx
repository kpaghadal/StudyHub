import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Layers, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CreateGroupModal = ({ onClose }) => {
  const { addGroup, topics, semesters } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    topic: topics[0] || 'Computer Science',
    semester: semesters[2] || 'Semester 3',
    description: '',
    tagInput: '',
    tags: [],
    pinned: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addGroup({ 
      name: formData.name, 
      topic: formData.topic, 
      semester: formData.semester, 
      description: formData.description, 
      tags: formData.tags, 
      pinned: formData.pinned 
    });
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTag = () => {
    const tag = formData.tagInput.trim().toUpperCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag], tagInput: '' }));
    }
  };

  const handleKeyDown = (e) => { 
    if (e.key === 'Enter') { 
      e.preventDefault(); 
      handleAddTag(); 
    } 
  };
  
  const removeTag = (t) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }));

  return (
    <div className="modal-backdrop" style={{
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 0,
        maxWidth: '560px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.05)'
      }}>
        {/* Header Ribbon */}
        <div style={{
          position: 'relative',
          padding: '2.5rem 2rem 1.5rem',
          background: 'linear-gradient(135deg, #f7f9fb 0%, #ffffff 100%)',
          borderBottom: '1px solid #f2f4f6'
        }}>
          {/* Decorative blur elements */}
          <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '8rem', height: '8rem', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '8rem', height: '8rem', background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(30px)' }} />

          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: '#ffffff', border: '1px solid #f2f4f6', borderRadius: '50%', width: '2rem', height: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#767586', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            zIndex: 10, transition: 'all 0.2s'
          }} onMouseEnter={(e) => { e.currentTarget.style.color = '#191c1e'; e.currentTarget.style.transform = 'scale(1.05)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.color = '#767586'; e.currentTarget.style.transform = 'scale(1)'; }}>
            <X size={14} />
          </button>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(99,102,241,0.25)' }}>
              <Users size={24} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#191c1e', letterSpacing: '-0.02em', margin: 0 }}>Create Study Group</h2>
              <p style={{ color: '#767586', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>Establish a new collaborative learning hub.</p>
            </div>
          </div>
        </div>

        {/* Form area */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <FormField label="Group Name" icon={<BookOpen size={14} />}>
              <input type="text" name="name" required placeholder="e.g. Machine Learning Fundamentals"
                value={formData.name} onChange={handleChange}
                style={inputStyle} />
            </FormField>

            <FormField label="Description" icon={<Layers size={14} />}>
              <textarea name="description" required placeholder="Briefly describe the group's focus and goals..."
                value={formData.description} onChange={handleChange}
                style={{ ...inputStyle, height: '6rem', resize: 'none' }} />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Topic Area">
                <div style={selectWrapperStyle}>
                  <select name="topic" value={formData.topic} onChange={handleChange} style={selectStyle}>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </FormField>
              
              <FormField label="Semester">
                <div style={selectWrapperStyle}>
                  <select name="semester" value={formData.semester} onChange={handleChange} style={selectStyle}>
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </FormField>
            </div>

            <FormField label="Focus Tags">
              <div style={{ 
                background: '#f7f9fb', border: '1px solid #e0e3e5', borderRadius: '0.75rem', 
                padding: '0.375rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center',
                transition: 'border-color 0.2s', minHeight: '3.125rem'
              }}>
                {formData.tags.map(tag => (
                  <span key={tag} style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem', 
                    background: '#eef2ff', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700, 
                    padding: '0.3rem 0.6rem', borderRadius: '0.5rem' 
                  }}>
                    {tag} 
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.7, padding: 0 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                      <X size={12} strokeWidth={3} />
                    </button>
                  </span>
                ))}
                
                <input type="text" name="tagInput" placeholder={formData.tags.length === 0 ? "Add tags (press Enter)..." : "Add more tags..."}
                  value={formData.tagInput} onChange={handleChange} onKeyDown={handleKeyDown}
                  style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', outline: 'none', padding: '0.375rem 0.5rem', fontSize: '0.875rem', color: '#191c1e', fontFamily: 'Inter, sans-serif' }} />
                
                <button type="button" onClick={handleAddTag} style={{ 
                  width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', background: '#e0e3e5', color: '#767586', 
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transition: 'all 0.2s'
                }} onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = '#e0e3e5'; e.currentTarget.style.color = '#767586'; }}>
                  <Plus size={14} />
                </button>
              </div>
            </FormField>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} style={{ 
                padding: '0.625rem 1.25rem', borderRadius: '999px', background: '#f2f4f6', color: '#464554', 
                border: '1px solid transparent', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = '#e0e3e5'} onMouseLeave={e => e.currentTarget.style.background = '#f2f4f6'}>
                Cancel
              </button>
              <button type="submit" style={{ 
                padding: '0.625rem 1.75rem', borderRadius: '999px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                color: '#ffffff', border: 'none', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.25)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.35)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.25)'; }}>
                <Plus size={16} /> Create Group
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, icon, children }) => (
  <div>
    <label style={{ 
      display: 'flex', alignItems: 'center', gap: '0.375rem', 
      fontSize: '0.75rem', fontWeight: 700, color: '#464554', 
      marginBottom: '0.625rem' 
    }}>
      {icon && <span style={{ color: '#a5b4fc' }}>{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', 
  background: '#f7f9fb', 
  border: '1px solid #e0e3e5',
  borderRadius: '0.75rem', 
  padding: '0.75rem 1rem', 
  fontSize: '0.875rem',
  fontFamily: 'Inter, sans-serif', 
  color: '#191c1e', 
  outline: 'none',
  transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s', 
  boxSizing: 'border-box',
};

const selectWrapperStyle = {
  position: 'relative',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none', 
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23767586' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, 
  backgroundRepeat: 'no-repeat', 
  backgroundPosition: 'right 1rem center'
};

export default CreateGroupModal;

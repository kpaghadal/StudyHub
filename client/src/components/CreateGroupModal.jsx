import React, { useState } from 'react';
import { X } from 'lucide-react';
import { topics, semesters } from '../data/mockData';

const CreateGroupModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    topic: topics[0],
    semester: semesters[0],
    description: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would dispatch an action or API call
    console.log("Creating group:", formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Create Study Group</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Group Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-input" 
              placeholder="e.g. Advanced Data Structures"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="form-group w-full">
              <label className="form-label">Topic</label>
              <select 
                name="topic" 
                className="form-input"
                value={formData.topic}
                onChange={handleChange}
              >
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="form-group w-full">
              <label className="form-label">Semester</label>
              <select 
                name="semester" 
                className="form-input"
                value={formData.semester}
                onChange={handleChange}
              >
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-input" 
              rows="3" 
              placeholder="What is this group about?"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input 
              type="text" 
              name="tags" 
              className="form-input" 
              placeholder="e.g. Java, Trees, Final Exam"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

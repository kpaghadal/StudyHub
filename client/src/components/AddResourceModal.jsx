import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, FileText, Video } from 'lucide-react';

const AddResourceModal = ({ onClose, groupId }) => {
  const [resourceType, setResourceType] = useState('PDF');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sharing resource to group", groupId, formData, resourceType);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Share Resource</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex gap-2 mb-6 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button 
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${resourceType === 'PDF' ? 'bg-white shadow text-primary' : 'text-muted hover:bg-slate-100'}`}
            onClick={() => setResourceType('PDF')}
          >
            <FileText size={16} /> Document
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${resourceType === 'Link' ? 'bg-white shadow text-primary' : 'text-muted hover:bg-slate-100'}`}
            onClick={() => setResourceType('Link')}
          >
            <LinkIcon size={16} /> Link
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${resourceType === 'Video' ? 'bg-white shadow text-primary' : 'text-muted hover:bg-slate-100'}`}
            onClick={() => setResourceType('Video')}
          >
            <Video size={16} /> Video
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input 
              type="text" 
              name="title" 
              className="form-input" 
              placeholder="E.g. Chapter 3 Summary Notes"
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          
          {resourceType === 'PDF' ? (
            <div className="form-group">
              <label className="form-label">Upload File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-primary" />
                <span className="font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-muted">PDF, DOCX, PPTX (MAX. 10MB)</span>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">URL Link</label>
              <input 
                type="url" 
                name="url" 
                className="form-input" 
                placeholder="https://"
                value={formData.url}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Brief Description (Optional)</label>
            <textarea 
              name="description" 
              className="form-input" 
              rows="2" 
              placeholder="What makes this resource helpful?"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Share with Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;

import React, { useState, useEffect } from 'react';
import { Trash2, Search, AlertCircle, FileText, Link as LinkIcon, Edit2, Filter, ExternalLink, Package, ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react';
import apiFetch from '../../utils/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 8;

  // Edit Modal State
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({ title: '', topic: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (resource) => {
    setEditingResource(resource);
    setFormData({ title: resource.title, topic: resource.topic || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/admin/resources/${editingResource._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update resource');
      
      await fetchResources();
      setEditingResource(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await apiFetch(`/admin/resources/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete resource');
      setResources(resources.filter(r => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resource Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Audit and regulate shared academic assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-700 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-8 h-8 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-400 text-sm">Cataloging assets...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category / Topic</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Reference</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentResources.length > 0 ? (
                  currentResources.map((resource) => (
                    <tr key={resource._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold ${resource.type === 'link' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {resource.type === 'link' ? <LinkIcon size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight truncate max-w-[250px]" title={resource.title}>{resource.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{resource.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                          {resource.topic || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a 
                          href={resource.type === 'file' ? resource.fileUrl : resource.linkUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(resource)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Resource"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(resource._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Resource"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                       <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                          <Package size={32} />
                        </div>
                        <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider">Inventory Depleted</h3>
                        <p className="text-slate-400 text-xs font-medium mt-1">No shared resources detected in current view</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Showing {indexOfFirstResource + 1} to {Math.min(indexOfLastResource, filteredResources.length)} of {filteredResources.length}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Modify Resource</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Edit asset properties</p>
              </div>
              <button 
                onClick={() => setEditingResource(null)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner"
                  placeholder="Descriptive title"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resource Category</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner"
                  placeholder="e.g. Mechanics, Calculus"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;

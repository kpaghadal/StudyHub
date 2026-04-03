import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, AlertCircle, Users, Layers, Filter, Edit2, ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react';
import apiFetch from '../../utils/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 8;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', topic: '', semester: '' });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({ 
        name: group.name, 
        description: group.description || '', 
        topic: group.topic || '', 
        semester: group.semester || '' 
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: '', description: '', topic: '', semester: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingGroup ? 'PUT' : 'POST';
      const url = editingGroup ? `/admin/groups/${editingGroup._id}` : '/admin/groups';
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save group');
      
      await fetchGroups();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group? All related resources will also be deleted.')) return;
    try {
      const res = await apiFetch(`/admin/groups/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete group');
      setGroups(groups.filter(g => g._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Group Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Regulate and organize study collectives</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={16} />
            Create Group
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
          <p className="text-slate-400 text-sm">Loading groups...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Group Identity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic / Semester</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Members</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentGroups.length > 0 ? (
                  currentGroups.map((group) => (
                    <tr key={group._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200 shrink-0">
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{group.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium line-clamp-1 max-w-[200px] mt-0.5">{group.description || 'Global learning circle'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{group.topic}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sem: {group.semester || 'All'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold text-xs">
                             <Users size={12} /> {group.memberCount || group.members?.length || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right px-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(group)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Group"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(group._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Group"
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
                          <LayoutGrid size={32} />
                        </div>
                        <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider">No Groups Recorded</h3>
                        <p className="text-slate-400 text-xs font-medium mt-1">Begin by creating a new collective above</p>
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
                Showing {indexOfFirstGroup + 1} to {Math.min(indexOfLastGroup, filteredGroups.length)} of {filteredGroups.length}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingGroup ? 'Update Collective' : 'Create Collective'}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Define academic workspace</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Collective Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner"
                  placeholder="e.g. Modern Physics 101"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Core Topic</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner"
                    placeholder="Subject domain"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Semester Cycle</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner"
                    placeholder="e.g. Fall 2024"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Workspace Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm shadow-inner resize-none"
                  placeholder="What is this collective about?"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
                >
                  {editingGroup ? 'Update Entry' : 'Register Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;

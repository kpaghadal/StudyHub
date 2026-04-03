import React, { useState, useEffect } from 'react';
import { Trash2, Search, AlertCircle, MessageSquare, Filter, User, Calendar, MessageCircle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import apiFetch from '../../utils/api';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/questions');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await apiFetch(`/admin/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete question');
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doubts Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Moderate user discussions and resolve queries</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search dialogues..."
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
          <p className="text-slate-400 text-sm">Parsing channels...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Conversation</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Context</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentQuestions.length > 0 ? (
                  currentQuestions.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all shrink-0 mt-1">
                            <MessageSquare size={16} />
                          </div>
                          <div className="max-w-[350px]">
                            <p className="text-slate-900 text-sm font-bold leading-tight line-clamp-2">{q.text}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(q.createdAt).toLocaleDateString()}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.userId?.name || 'User'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
                           {q.topic || 'General'}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                           q.status === 'resolved' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                         }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${q.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                           {q.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(q._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Inquiry"
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
                          <Inbox size={32} />
                        </div>
                        <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider">No Doubts Found</h3>
                        <p className="text-slate-400 text-xs font-medium mt-1">The communication channels are currently quiet</p>
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
                Showing {indexOfFirstQuestion + 1} to {Math.min(indexOfLastQuestion, filteredQuestions.length)} of {filteredQuestions.length}
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
    </div>
  );
};

export default Questions;

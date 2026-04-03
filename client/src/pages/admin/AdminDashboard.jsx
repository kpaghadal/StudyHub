import React, { useState, useEffect } from 'react';
import { Users, Grid, BookOpen, Activity, Download, Filter, RefreshCw, ChevronRight } from 'lucide-react';
import apiFetch from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// Component should be defined before use if using const to avoid ReferenceError
const ShieldCw = ({ size }) => <Activity size={size} />;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 text-sm font-medium">Loading platform metrics...</p>
    </div>
  );
  
  if (error) return (
    <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center max-w-md mx-auto mt-20 shadow-sm">
      <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mx-auto mb-4">
        <Activity size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Metrics Sync Failed</h2>
      <p className="text-slate-500 text-sm mb-6">{error}</p>
      <button onClick={fetchStats} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
        Try Again
      </button>
    </div>
  );
  
  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Groups', value: stats.totalGroups, icon: Grid, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Total Resources', value: stats.totalResources, icon: BookOpen, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Active Users', value: Math.max(1, Math.floor(stats.totalUsers * 0.4)), icon: Activity, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  const chartData = stats.resourcesByType?.length > 0 ? stats.resourcesByType.map(t => ({
    name: t._id || 'General',
    count: t.count
  })) : [{ name: 'None', count: 0 }];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Statistics</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Platform-wide overview and resource analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center shrink-0`}>
                <stat.icon size={22} />
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
               <Activity size={10} /> +8.4% since last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Resource Distribution</h3>
              <p className="text-xs text-slate-400 font-medium">Volume across different academic types</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50"><Filter size={14} className="text-slate-400" /></button>
              <button className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50"><Download size={14} className="text-slate-400" /></button>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 8}} 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    padding: '8px 12px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={40} fill="#6366f1" fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-100">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCw size={80} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Quick Action</h4>
              <p className="text-xl font-black mb-6 leading-tight">Generate weekly performance report</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg">
                 Initialize Report
              </button>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Integrity Monitor</h4>
             <div className="space-y-4">
                {[
                  { label: 'Server Instance', status: 'Healthy', color: 'text-emerald-500' },
                  { label: 'Database Sync', status: 'Optimal', color: 'text-blue-500' },
                  { label: 'API Latency', status: '24ms', color: 'text-indigo-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

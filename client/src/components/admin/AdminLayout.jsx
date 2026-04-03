import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Fixed to left or floating as requested */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white">
        <AdminSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar Placeholder / Margin */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Admin Control</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm">
                A
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


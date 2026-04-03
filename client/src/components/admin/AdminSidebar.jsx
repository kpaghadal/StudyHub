import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  User, 
  LayoutGrid, 
  FileText, 
  MessageSquare, 
  LogOut, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminSidebar = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', end: true, icon: Activity, label: 'Dashboard Overview' },
    { to: '/admin/users', icon: User, label: 'Identities' },
    { to: '/admin/groups', icon: LayoutGrid, label: 'Collectives' },
    { to: '/admin/resources', icon: FileText, label: 'Inventory' },
    { to: '/admin/questions', icon: MessageSquare, label: 'Inquiries' },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="sidebar-avatar">
            <span className="avatar-text" style={{ fontSize: '1rem' }}>SH</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">StudyHub</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">DIGITAL ATELIER</span>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operations Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-slate-100 text-slate-900 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`
              }
            >
              <item.icon size={19} className="transition-colors group-data-[active=true]:text-indigo-600 text-slate-400 group-hover:text-slate-600" />
              <span className="text-[13px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-100 space-y-2">
        <button 
          onClick={() => navigate('/app')} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors text-xs font-bold"
        >
          <ExternalLink size={18} className="text-slate-400" />
          User Interface
        </button>
        <button 
          onClick={() => {
            if (logout) logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors text-xs font-black uppercase tracking-wider"
        >
          <LogOut size={18} className="text-rose-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

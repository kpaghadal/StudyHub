import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CreateGroupModal from './CreateGroupModal';

const Layout = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-wrapper">
        <Header onAddGroup={() => setIsCreateGroupOpen(true)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {isCreateGroupOpen && (
        <CreateGroupModal onClose={() => setIsCreateGroupOpen(false)} />
      )}
    </div>
  );
};

export default Layout;

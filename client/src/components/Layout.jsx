import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <Header />
      <div className="content-wrapper" style={{ flexDirection: 'row', backgroundColor: '#f7f9fb' }}>
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

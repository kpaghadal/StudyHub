import React from 'react';
import { Outlet } from 'react-router-dom';
import GuestNavbar from './GuestNavbar';

const GuestLayout = () => {
  return (
    <div className="guest-layout-wrapper">
      <GuestNavbar />
      <main className="guest-main-content">
        <Outlet />
      </main>
      <footer className="guest-footer text-muted border-top text-center mt-auto">
        <p>© 2026 StudyHub Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestLayout;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/Toast';
import GuestLayout from './components/GuestLayout';
import Layout from './components/Layout';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';

// Guest Pages
import Home from './pages/guest/Home';
import Features from './pages/guest/Features';
import About from './pages/guest/About';
import Contact from './pages/guest/Contact';
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';
import GuestGroups from './pages/guest/GuestGroups';
import GuestResources from './pages/guest/GuestResources';

// User Pages
import GroupList from './pages/user/GroupList';
import GroupDetail from './pages/user/GroupDetail';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Resources from './pages/user/Resources';
import ResourceDetail from './pages/user/ResourceDetail';
import Library from './pages/user/Library';
import Schedule from './pages/user/Schedule';
import Events from './pages/user/Events';
import DoubtChat from './pages/user/DoubtChat';
// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Groups from './pages/admin/Groups';
import AdminResources from './pages/admin/Resources';
import Questions from './pages/admin/Questions';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="guest/groups" element={<GuestGroups />} />
            <Route path="guest/resources" element={<GuestResources />} />
            <Route element={<GuestRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>

          {/* User Dashboard Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
             <Route path="/app" element={<Layout />}>
               <Route index element={<Dashboard />} />
               <Route path="groups" element={<GroupList />} />
               <Route path="groups/:id" element={<GroupDetail />} />
               <Route path="profile" element={<Profile />} />
               <Route path="resources" element={<Resources />} />
               <Route path="resources/:id" element={<ResourceDetail />} />
               <Route path="library" element={<Library />} />
               <Route path="schedule" element={<Schedule />} />
               <Route path="events" element={<Events />} />
               <Route path="doubts" element={<DoubtChat />} />
             </Route>
          </Route>

          {/* Admin Routes (Protected via Role) */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
             <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route path="users" element={<Users />} />
               <Route path="groups" element={<Groups />} />
               <Route path="resources" element={<AdminResources />} />
               <Route path="questions" element={<Questions />} />
             </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AppProvider>
  );
}

export default App;

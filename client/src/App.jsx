import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/Toast';
import GuestLayout from './components/GuestLayout';
import Layout from './components/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Library from './pages/Library';
import Schedule from './pages/Schedule';
import Events from './pages/Events';
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
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="groups" element={<GroupList />} />
            <Route path="groups/:id" element={<GroupDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="resources" element={<Resources />} />
            <Route path="library" element={<Library />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="events" element={<Events />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AppProvider>
  );
}

export default App;

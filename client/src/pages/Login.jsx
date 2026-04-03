import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { refreshData } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      return setError('Please enter a valid email address');
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user token/details securely
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data));
      
      // Refresh context data with the new user before navigating
      await refreshData();
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative background orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-3"></div>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <Users size={28} className="auth-icon" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your digital atelier</p>
        </div>

        {error && (
          <div className="auth-alert error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>University Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                required 
                placeholder="student@university.edu" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="loader-dot"></span> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

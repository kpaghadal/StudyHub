import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { register } from '../../services/authService';
import './Auth.css'; 

const Register = () => {
  const navigate = useNavigate();
  const { refreshData } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      const data = await register(formData);
      
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data));
      
      await refreshData();
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
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
      <div className="orb orb-2"></div>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <Users size={28} className="auth-icon" />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join StudyHub and start collaborating</p>
        </div>

        {error && (
          <div className="auth-alert error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                required 
                placeholder="Alex Johnson" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

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
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                required 
                placeholder="Create a strong password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="loader-dot"></span> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import './GuestPages.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/app');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary mb-4">
            <Users size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to access your study groups</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Context</label>
            <input type="email" required className="form-input" placeholder="student@university.edu" />
          </div>
          <div className="form-group mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <input type="password" required className="form-input" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 text-base">Sign In</button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

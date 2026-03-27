import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import './GuestPages.css';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate register
    navigate('/app');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary mb-4">
            <Users size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
          <p className="text-muted mt-2">Join your peers and start collaborating</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="form-input" placeholder="Alex Johnson" />
          </div>
          <div className="form-group">
            <label className="form-label">University Email</label>
            <input type="email" required className="form-input" placeholder="student@university.edu" />
          </div>
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" placeholder="Create a strong password" />
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 text-base">Create Account</button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

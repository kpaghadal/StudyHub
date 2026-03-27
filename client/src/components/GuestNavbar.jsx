import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import './GuestNavbar.css';

const GuestNavbar = () => {
  return (
    <nav className="guest-nav glass-panel">
      <div className="nav-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <Users size={24} color="white" />
          </div>
          <h1 className="logo-text">StudyHub</h1>
        </Link>
        
        <ul className="nav-links">
          <li><NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
          <li><NavLink to="/features" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Features</NavLink></li>
          <li><NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink></li>
        </ul>
        
        <div className="nav-auth">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;

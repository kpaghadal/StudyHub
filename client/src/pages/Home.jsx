import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Share2 } from 'lucide-react';
import './GuestPages.css';

const Home = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Your Courses Together.</h1>
          <p className="hero-subtitle">
            Join thousands of students creating study groups, sharing notes, and collaborating to ace their semesters.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">Get Started</Link>
            <Link to="/features" className="btn btn-outline text-lg px-8 py-3 bg-white">Explore Features</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card mockup-card">
            <div className="mockup-header"></div>
            <div className="mockup-body">
              <div className="mockup-line w-3/4"></div>
              <div className="mockup-line w-full"></div>
              <div className="mockup-line w-5/6"></div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="mockup-box"></div>
                <div className="mockup-box"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-preview">
        <div className="container">
          <h2 className="section-title text-center">Why join StudyHub?</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon"><Users size={32} /></div>
              <h3>Collaborative Study Groups</h3>
              <p className="text-muted">Find or create groups specifically for your courses and subjects.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><BookOpen size={32} /></div>
              <h3>Resource Library</h3>
              <p className="text-muted">Access a massive library of past papers, lecture notes, and study guides.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Share2 size={32} /></div>
              <h3>Instant Sharing</h3>
              <p className="text-muted">Upload PDFs, links, and video tutorials directly with your peers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

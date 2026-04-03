import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Share2, MessageCircle, TrendingUp, Zap, ArrowRight, Star, Shield, Globe } from 'lucide-react';
import './GuestPages.css';

const API = 'http://localhost:5000/api';

// Animated counter hook
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ icon, label, value, color, delay }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="stat-number">{count.toLocaleString()}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState({ totalGroups: 0, totalResources: 0, totalUsers: 0, totalMessages: 0 });
  const [groups, setGroups] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch groups and resources (these APIs already exist and work)
        const [grpRes, resRes] = await Promise.all([
          fetch(`${API}/groups`),
          fetch(`${API}/resources`),
        ]);

        const groupsData = grpRes.ok ? await grpRes.json() : [];
        const resourcesData = resRes.ok ? await resRes.json() : [];

        const groupsList = Array.isArray(groupsData) ? groupsData : [];
        const resourcesList = Array.isArray(resourcesData) ? resourcesData : [];

        setGroups(groupsList.slice(0, 6));
        setResources(resourcesList.slice(0, 6));

        // Try the dedicated stats endpoint
        let statsData = null;
        try {
          const statsRes = await fetch(`${API}/stats`);
          if (statsRes.ok) {
            statsData = await statsRes.json();
          }
        } catch (statErr) {
          console.warn('Stats endpoint not available, calculating from data:', statErr);
        }

        // Use stats API result if valid, otherwise compute from fetched data
        if (statsData && typeof statsData.totalGroups === 'number') {
          setStats(statsData);
        } else {
          // Fallback: calculate counts from the data we already have
          setStats({
            totalGroups: groupsList.length,
            totalResources: resourcesList.length,
            totalUsers: (() => {
              const memberSet = new Set();
              groupsList.forEach(g => {
                (g.members || []).forEach(m => {
                  const id = m._id || m;
                  if (id) memberSet.add(id.toString());
                });
              });
              return memberSet.size || groupsList.length;
            })(),
            totalMessages: 0,
          });
        }
      } catch (err) {
        console.error('Home page fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);


  const features = [
    { icon: <Users size={28} />, title: 'Study Groups', desc: 'Create or join groups tailored to your courses and subjects. Collaborate in real-time.', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { icon: <BookOpen size={28} />, title: 'Resource Library', desc: 'Access thousands of notes, PDFs, past papers, and video tutorials shared by peers.', color: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
    { icon: <MessageCircle size={28} />, title: 'Live Discussion', desc: 'Chat, ask doubts, and get solutions privately from fellow students in real-time.', color: 'linear-gradient(135deg,#10b981,#0ea5e9)' },
    { icon: <Share2 size={28} />, title: 'Instant Sharing', desc: 'Upload PDFs, links, and videos. Downloads work instantly with one click.', color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { icon: <Zap size={28} />, title: 'Smart Notifications', desc: 'Get instant alerts when new resources or messages arrive in your joined groups.', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
    { icon: <Shield size={28} />, title: 'Secure & Private', desc: 'Your private doubt replies are only visible to you and the responding peer.', color: 'linear-gradient(135deg,#10b981,#6366f1)' },
  ];

  const typeColor = (type) => {
    const map = { PDF: '#ef4444', Video: '#8b5cf6', Link: '#0ea5e9', Notes: '#10b981', Document: '#f59e0b' };
    return map[type] || '#6366f1';
  };

  return (
    <div className="landing-page">
      {/* ── HERO ── */}
      <section className="hero-section hero-fullbleed">
        <div className="hero-bg-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="hero-content-wrap">
          <div className="hero-badge"><Star size={12} /> Trusted by 1000+ students</div>
          <h1 className="hero-title">
            Master Your Courses<br />
            <span className="gradient-text">Together.</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of students creating study groups, sharing resources,
            and collaborating to ace their semesters — all in one beautiful platform.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-hero">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/guest/groups" className="btn btn-outline btn-hero">
              Browse Groups
            </Link>
          </div>
          <div className="hero-trust">
            {['MongoDB', 'Real-time', 'Secure', 'Open'].map(t => (
              <span key={t} className="trust-badge">✓ {t}</span>
            ))}
          </div>
        </div>
        <div className="hero-visual-wrap">
          <div className="hero-mockup">
            <div className="mockup-topbar">
              <div className="mockup-dots"><span /><span /><span /></div>
              <div className="mockup-url">studyhub.io/app</div>
            </div>
            <div className="mockup-content">
              <div className="mockup-sidebar">
                {['Dashboard', 'Groups', 'Resources', 'Chat'].map(i => (
                  <div key={i} className="mockup-nav-item">{i}</div>
                ))}
              </div>
              <div className="mockup-main">
                <div className="mockup-stat-row">
                  {!loading ? [
                    { v: stats.totalGroups, l: 'Groups' },
                    { v: stats.totalResources, l: 'Resources' },
                    { v: stats.totalUsers, l: 'Members' },
                  ].map(s => (
                    <div key={s.l} className="mockup-stat">
                      <div className="mockup-stat-num">{s.v}</div>
                      <div className="mockup-stat-lbl">{s.l}</div>
                    </div>
                  )) : [1,2,3].map(i => <div key={i} className="mockup-stat skeleton-stat" />)}
                </div>
                <div className="mockup-card-grid">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="mockup-mini-card" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="floating-badge fb-1"><TrendingUp size={14} /> Live Updates</div>
          <div className="floating-badge fb-2"><Globe size={14} /> {stats.totalUsers || '...'} Members</div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className="stats-section">
        <div className="container">
          <div className="section-eyebrow">Platform at a Glance</div>
          <h2 className="section-title text-center">Real numbers, <span className="gradient-text">real impact</span></h2>
          <div className="stats-grid">
            <StatCard icon={<Users size={24} />} label="Study Groups" value={stats.totalGroups} color="linear-gradient(135deg,#6366f1,#8b5cf6)" delay={0} />
            <StatCard icon={<BookOpen size={24} />} label="Resources Shared" value={stats.totalResources} color="linear-gradient(135deg,#0ea5e9,#6366f1)" delay={100} />
            <StatCard icon={<Users size={24} />} label="Active Members" value={stats.totalUsers} color="linear-gradient(135deg,#10b981,#0ea5e9)" delay={200} />
          </div>
        </div>
      </section>

      {/* ── FEATURED GROUPS ── */}
      <section className="browse-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">Explore Communities</div>
              <h2 className="section-title">Active Study Groups</h2>
            </div>
            <Link to="/guest/groups" className="btn btn-outline">View All <ArrowRight size={15} /></Link>
          </div>
          {loading ? (
            <div className="cards-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="guest-card skeleton-card" />)}
            </div>
          ) : groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <p>No groups yet. <Link to="/register">Be the first to create one!</Link></p>
            </div>
          ) : (
            <div className="cards-grid">
              {groups.map((g, i) => {
                const colors = ['linear-gradient(135deg,#6366f1,#8b5cf6)','linear-gradient(135deg,#0ea5e9,#6366f1)','linear-gradient(135deg,#10b981,#0ea5e9)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#10b981,#6366f1)'];
                const memCount = g.memberCount || (Array.isArray(g.members) ? g.members.length : 0);
                return (
                  <div key={g._id} className="guest-card group-card" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="guest-card-banner" style={{ background: colors[i % colors.length] }}>
                      <span className="card-topic-pill">{g.topic || 'General'}</span>
                      <span className="card-semester-pill">{g.semester || ''}</span>
                    </div>
                    <div className="guest-card-body">
                      <h3 className="guest-card-title">{g.name}</h3>
                      <p className="guest-card-desc">{g.description?.slice(0, 90) || 'Join this group to get started.'}{g.description?.length > 90 ? '...' : ''}</p>
                      <div className="guest-card-footer">
                        <span className="member-count"><Users size={13} /> {memCount} members</span>
                        <Link to="/register" className="card-join-btn">Join →</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-eyebrow">Why StudyHub?</div>
          <h2 className="section-title text-center">Everything you need to <span className="gradient-text">excel</span></h2>
          <div className="features-grid-new">
            {features.map((f, i) => (
              <div key={i} className="feature-card-new" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="feature-icon-new" style={{ background: f.color }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT RESOURCES ── */}
      <section className="browse-section browse-alt">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">Fresh Uploads</div>
              <h2 className="section-title">Latest Resources</h2>
            </div>
            <Link to="/guest/resources" className="btn btn-outline">View All <ArrowRight size={15} /></Link>
          </div>
          {loading ? (
            <div className="res-list-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="res-guest-item skeleton-card" style={{ height: 72 }} />)}
            </div>
          ) : resources.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📂</div><p>No resources shared yet.</p></div>
          ) : (
            <div className="res-list-grid">
              {resources.map((r, i) => (
                <div key={r._id} className="res-guest-item" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="res-type-dot" style={{ background: typeColor(r.type) }}>
                    {r.type?.charAt(0) || 'F'}
                  </div>
                  <div className="res-info">
                    <p className="res-title">{r.title}</p>
                    <p className="res-meta">{r.author || 'Scholar'} · <span style={{ color: typeColor(r.type) }}>{r.type}</span></p>
                  </div>
                  <Link to="/register" className="res-access-btn">Access →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg-blob" />
            <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Ready to level up?</div>
            <h2 className="cta-title">Join {stats.totalUsers > 0 ? `${stats.totalUsers}+` : 'thousands of'} students already on StudyHub</h2>
            <p className="cta-desc">Create your free account and start collaborating with peers, sharing resources, and acing your exams.</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-white btn-hero">Create Free Account <ArrowRight size={16} /></Link>
              <Link to="/login" className="btn btn-outline-white btn-hero">Sign In</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import './GuestPages.css';

const About = () => {
  const [aboutConfig, setAboutConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/content');
        const data = await res.json();
        const mission = data.find(c => c.page === 'about' && c.section === 'mission');
        setAboutConfig(mission);
      } catch (err) {
        console.error('Failed to fetch about config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="simple-page">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">About StudyHub</h1>
      
      {loading ? (
        <div className="text-center text-muted">Loading...</div>
      ) : (
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{aboutConfig ? aboutConfig.title : 'Our Mission'}</h2>
          <p className="text-lg text-muted leading-relaxed mb-4">
            {aboutConfig ? aboutConfig.body.split('. We believe')[0] + '.' : 'Loading mission...'}
          </p>
          <p className="text-lg text-muted leading-relaxed">
            {aboutConfig ? 'We believe' + aboutConfig.body.split('. We believe')[1] : null}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Join Our Journey</h3>
          <p className="text-muted mb-4">We are continuously taking feedback and improving the platform. Feel free to reach out if you want to contribute!</p>
        </div>
      </div>
    </div>
  );
};

export default About;

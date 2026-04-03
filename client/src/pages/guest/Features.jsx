import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Share2, MessageSquare, Tags, Search } from 'lucide-react';
import './GuestPages.css';

const iconMap = {
  Users: <Users size={32} className="text-primary mb-4" />,
  BookOpen: <BookOpen size={32} className="text-primary mb-4" />,
  Share2: <Share2 size={32} className="text-secondary mb-4" />,
  MessageSquare: <MessageSquare size={32} className="text-accent mb-4" />,
  Tags: <Tags size={32} className="text-primary mb-4" />,
  Search: <Search size={32} className="text-primary mb-4" />
};

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/content');
        const data = await res.json();
        const featureContent = data.filter(c => c.page === 'features');
        setFeatures(featureContent);
      } catch (err) {
        console.error('Failed to fetch features:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="simple-page">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Core Features</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Everything you need to organize your study life, collaborate with peers, and excel in your courses.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-muted">Loading features...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(feature => (
            <div key={feature._id} className="glass-card p-8">
              {iconMap[feature.extra?.icon] || <BookOpen size={32} className="text-primary mb-4" />}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Features;

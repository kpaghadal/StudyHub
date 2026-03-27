import React from 'react';
import { Users, BookOpen, Share2, MessageSquare, Tags, Search } from 'lucide-react';
import './GuestPages.css';

const Features = () => {
  return (
    <div className="simple-page">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Core Features</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Everything you need to organize your study life, collaborate with peers, and excel in your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <Users size={32} className="text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Dedicated Study Groups</h3>
          <p className="text-muted">Create groups specific to a subject and semester. Isolate your focus and learn together with your class.</p>
        </div>
        
        <div className="glass-card p-8">
          <Share2 size={32} className="text-secondary mb-4" />
          <h3 className="text-xl font-bold mb-2">Resource Sharing Hub</h3>
          <p className="text-muted">Upload PDFs, links, and video resources. Categorize them and let the group download or view them instantly.</p>
        </div>

        <div className="glass-card p-8">
          <MessageSquare size={32} className="text-accent mb-4" />
          <h3 className="text-xl font-bold mb-2">Real-time Group Chat</h3>
          <p className="text-muted">Built-in messaging allows you to ask questions, plan study sessions, and communicate directly in the group.</p>
        </div>

        <div className="glass-card p-8">
          <Search size={32} className="text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Smart Discovery</h3>
          <p className="text-muted">Use smart filters by topic and semester to find existing groups instead of creating redundant ones.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;

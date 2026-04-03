import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import './GuestPages.css';

const Contact = () => {
  return (
    <div className="simple-page">
      <h1 className="text-4xl font-bold text-primary mb-2 text-center">Contact Us</h1>
      <p className="text-center text-muted mb-12">We'd love to hear from you. Send us a message.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form className="glass-card p-8" onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input" rows="5" placeholder="How can we help you?"></textarea>
          </div>
          <button className="btn btn-primary w-full py-3">Send Message</button>
        </form>

        <div className="flex flex-col gap-6 justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-muted">support@studyhub.edu</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold">Phone</h3>
              <p className="text-muted">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold">Campus Office</h3>
              <p className="text-muted">Student Tech Center, Room 402</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

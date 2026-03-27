import React from 'react';
import './GuestPages.css';

const About = () => {
  return (
    <div className="simple-page">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">About StudyHub</h1>
      
      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-muted leading-relaxed mb-4">
          StudyHub was created during a hackathon to solve a common problem: fragmented communication and resource loss across different student chat groups and portals.
        </p>
        <p className="text-lg text-muted leading-relaxed">
          We believe that collaborative learning should be seamless, organized, and accessible to everyone. Our platform aims to centralize study groups so that every resource shared is preserved for the entire semester.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* <div className="glass-card p-6 text-center">
          <div className="avatar mx-auto mb-4" style={{width: 80, height: 80, fontSize: '2rem'}}>RS</div>
          <h3 className="text-xl font-bold">Rahul S.</h3>
          <p className="text-primary">Founder & Developer</p>
        </div> */}
        <div className="glass-card p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Join Our Journey</h3>
          <p className="text-muted mb-4">We are continuously taking feedback and improving the platform. Feel free to reach out if you want to contribute!</p>
        </div>
      </div>
    </div>
  );
};

export default About;

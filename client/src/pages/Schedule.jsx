import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Users, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const schedule = [
  { day: 'Monday', time: '10:00 AM', title: 'DSA Problem Set Review', group: 'Data Structures & Algorithms', duration: '90 min', color: '#6366f1' },
  { day: 'Tuesday', time: '3:00 PM', title: 'React Hooks Workshop', group: 'Web Development Bootcamp', duration: '60 min', color: '#10b981' },
  { day: 'Wednesday', time: '5:00 PM', title: 'Calculus Mock Exam Prep', group: 'Calculus III Study Group', duration: '120 min', color: '#f59e0b' },
  { day: 'Thursday', time: '11:00 AM', title: 'ML Paper Discussion', group: 'Machine Learning Fundamentals', duration: '45 min', color: '#8b5cf6' },
  { day: 'Friday', time: '2:00 PM', title: 'Full Stack Project Review', group: 'Web Development Bootcamp', duration: '90 min', color: '#10b981' },
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Schedule() {
  const navigate = useNavigate();
  const { groups } = useApp();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eef2ff', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>WEEKLY PLAN</span>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>Study Schedule</h1>
        <p style={{ color: '#767586', fontSize: '0.875rem' }}>Your personalized weekly study planner across all groups.</p>
      </div>

      {/* Week Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {weekDays.map((day, i) => {
          const isToday = day === today;
          const hasSession = schedule.some(s => s.day === day);
          return (
            <div key={day} style={{ background: isToday ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff', borderRadius: '1rem', padding: '0.875rem 0.5rem', textAlign: 'center', boxShadow: isToday ? '0 4px 12px rgba(99,102,241,0.35)' : '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: isToday ? 'rgba(255,255,255,0.7)' : '#767586', marginBottom: '0.25rem' }}>{day.slice(0, 3)}</p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: isToday ? '#fff' : '#191c1e' }}>{i + 24}</p>
              {hasSession && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isToday ? '#fff' : '#6366f1', margin: '0.25rem auto 0' }} />}
            </div>
          );
        })}
      </div>

      {/* Sessions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {weekDays.filter(d => schedule.some(s => s.day === d)).map(day => {
          const sessions = schedule.filter(s => s.day === day);
          const isToday = day === today;
          return (
            <div key={day}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: isToday ? '#6366f1' : '#191c1e' }}>{day}</span>
                {isToday && <span style={{ background: '#eef2ff', color: '#6366f1', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>TODAY</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessions.map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ minWidth: '5rem' }}>
                      <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#191c1e' }}>{s.time}</p>
                      <p style={{ fontSize: '0.7rem', color: '#767586', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={10} /> {s.duration}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#191c1e', marginBottom: '0.25rem' }}>{s.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: s.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={11} /> {s.group}</p>
                    </div>
                    <button onClick={() => navigate(`/app/groups/${groups.find(g => g.name === s.group)?.id || 1}`)} style={{ background: s.color + '15', color: s.color, border: 'none', borderRadius: '999px', padding: '0.4rem 0.875rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      Join <ChevronRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ marginTop: '2rem', background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: '#191c1e', marginBottom: '1.25rem' }}>Weekly Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
          {[
            { v: schedule.length, l: 'Sessions', icon: '📚' },
            { v: '7.5h', l: 'Study Time', icon: '⏱️' },
            { v: groups.length, l: 'Groups Active', icon: '👥' },
            { v: 5, l: 'Days Planned', icon: '📅' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center', background: '#f7f9fb', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#191c1e', lineHeight: 1 }}>{s.v}</p>
              <p style={{ fontSize: '0.7rem', color: '#767586', fontWeight: 500 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

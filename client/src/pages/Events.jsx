import React from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';

const events = [
  { id: 1, title: 'Mock Interview Marathon', group: 'Data Structures & Algorithms', date: '2026-03-29', time: '10:00 AM', location: 'Online - Google Meet', attendees: 34, color: '#6366f1', emoji: '🎯' },
  { id: 2, title: 'React Workshop: Hooks Deep Dive', group: 'Web Development Bootcamp', date: '2026-03-31', time: '2:00 PM', location: 'Room B-204', attendees: 22, color: '#10b981', emoji: '⚛️' },
  { id: 3, title: 'Calculus Problem-Solving Session', group: 'Calculus III Study Group', date: '2026-04-01', time: '4:00 PM', location: 'Library Hall 1', attendees: 15, color: '#f59e0b', emoji: '📐' },
  { id: 4, title: 'ML Paper Reading Club', group: 'Machine Learning Fundamentals', date: '2026-04-03', time: '6:00 PM', location: 'Online - Discord', attendees: 28, color: '#8b5cf6', emoji: '🤖' },
  { id: 5, title: 'Physics Lab Review', group: 'Physics 101 Labs', date: '2026-04-05', time: '11:00 AM', location: 'Lab 3-A', attendees: 12, color: '#ef4444', emoji: '⚗️' },
];

export default function Events() {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const daysUntil = (d) => Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000));

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eef2ff', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>UPCOMING</span>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#191c1e', marginBottom: '0.375rem' }}>Events & Sessions</h1>
        <p style={{ color: '#767586', fontSize: '0.875rem' }}>Upcoming study sessions, workshops, and group activities.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'This Week', value: 2, icon: '📅', bg: '#eef2ff', c: '#6366f1' },
          { label: 'Registered', value: 3, icon: '✅', bg: '#f0fdf4', c: '#10b981' },
          { label: 'Total Events', value: events.length, icon: '🎉', bg: '#fffbeb', c: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{s.icon}</div>
            <div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: '#767586', fontWeight: 500 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map(ev => {
          const days = daysUntil(ev.date);
          return (
            <div key={ev.id} style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ev.color + '40'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
              {/* Date Block */}
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.875rem', background: ev.color + '15', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${ev.color}25` }}>
                <span style={{ fontSize: '1.25rem' }}>{ev.emoji}</span>
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#191c1e', marginBottom: '0.25rem' }}>{ev.title}</h3>
                <p style={{ fontSize: '0.78rem', color: ev.color, fontWeight: 600, marginBottom: '0.375rem' }}>{ev.group}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', fontSize: '0.72rem', color: '#767586' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={11} /> {formatDate(ev.date)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} /> {ev.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={11} /> {ev.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={11} /> {ev.attendees} attending</span>
                </div>
              </div>
              {/* Badge */}
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ background: days <= 2 ? '#fff1f2' : '#f7f9fb', color: days <= 2 ? '#ef4444' : '#767586', borderRadius: '0.75rem', padding: '0.5rem 0.875rem', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: days <= 2 ? '#ef4444' : '#191c1e', lineHeight: 1 }}>{days}</p>
                  <p style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>days left</p>
                </div>
                <button style={{ background: ev.color, color: '#fff', border: 'none', borderRadius: '999px', padding: '0.4rem 0.875rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  RSVP <ChevronRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Banner */}
      <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '1.5rem', padding: '1.75rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.375rem' }}>📆 Group Calendar Coming Soon</h3>
          <p style={{ fontSize: '0.82rem', opacity: 0.85 }}>Create, schedule, and sync study sessions across all your groups in one place.</p>
        </div>
        <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '999px', padding: '0.625rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
          Get Notified
        </button>
      </div>
    </div>
  );
}

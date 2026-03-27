import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Filter, Clock } from 'lucide-react';
import { mockGroups, topics, semesters } from '../data/mockData';
import './GroupList.css';

const GroupList = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Filter groups
  const filteredGroups = mockGroups.filter(group => {
    const topicMatch = selectedTopic === 'All' || group.topic === selectedTopic;
    const semesterMatch = selectedSemester === 'All' || group.semester === selectedSemester;
    return topicMatch && semesterMatch;
  });

  return (
    <div className="group-list-container">
      <div className="page-header flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Discover Groups</h1>
          <p className="text-muted">Find and join study communities that match your coursework.</p>
        </div>
      </div>

      <div className="filters-container glass-card mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <span className="font-semibold">Filters:</span>
        </div>
        
        <div className="filter-group">
          <label className="text-sm font-medium">Topic</label>
          <select 
            className="filter-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="All">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label className="text-sm font-medium">Semester</label>
          <select 
            className="filter-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="All">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="groups-grid">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <div 
              key={group.id} 
              className="group-card glass-card"
              onClick={() => navigate(`/app/groups/${group.id}`)}
            >
              <div className="group-card-header">
                {group.pinned && <div className="pinned-badge">Pinned</div>}
                <div className="topic-badge">{group.topic}</div>
                <div className="semester-badge">{group.semester}</div>
              </div>
              
              <h3 className="group-name">{group.name}</h3>
              <p className="group-desc">{group.description}</p>
              
              <div className="group-tags">
                {group.tags.map(tag => (
                  <span key={tag} className="badge badge-outline">{tag}</span>
                ))}
              </div>
              
              <div className="group-card-footer mt-4">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <Users size={16} />
                  <span>{group.members} members</span>
                </div>
                <div className="flex items-center gap-2 text-light text-xs">
                  <Clock size={14} />
                  <span>{group.recentActivity}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p className="text-muted">No groups found matching your filters.</p>
            <button 
              className="btn btn-outline mt-2"
              onClick={() => { setSelectedTopic('All'); setSelectedSemester('All'); }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;

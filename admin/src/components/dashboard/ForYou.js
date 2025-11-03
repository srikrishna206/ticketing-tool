



//after the deploy

import React, { useEffect, useState } from 'react';
import { listIssues, listNotifs } from '../../services/mockApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

export default function ForYou() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext instead of mockApi
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Enhanced function to extract and format name from email
  const getDisplayName = (user) => {
    if (!user) return 'User';
    
    // If user has a name field, use it
    if (user.name && user.name.trim()) {
      return user.name;
    }
    
    // Extract name from email
    if (user.email) {
      const namePart = user.email.split('@')[0];
      
      // Handle different email formats
      // e.g., john.doe@example.com -> John Doe
      // e.g., mounika@gmail.com -> Mounika
      
      const nameWords = namePart
        .split(/[._-]/) // Split by dots, underscores, or hyphens
        .filter(word => word.length > 0) // Remove empty strings
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return nameWords || 'User';
    }
    
    return 'User';
  };

  useEffect(() => {
    // Fetch issues
    listIssues().then((res) => {
      if (Array.isArray(res)) setIssues(res);
      else if (res?.data && Array.isArray(res.data)) setIssues(res.data);
      else setIssues([]);
    });

    // Fetch notifications
    listNotifs().then((res) => {
      if (Array.isArray(res)) setNotifications(res);
      else if (res?.data && Array.isArray(res.data)) setNotifications(res.data);
      else setNotifications([]);
    });
  }, []);

  const mine = Array.isArray(issues) && user
    ? issues.filter((i) => i.assignee === user.id)
    : [];

  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date(new Date().setDate(new Date().getDate() + 7))
    .toISOString()
    .slice(0, 10);

  const filteredIssues = mine.filter((i) => {
    if (!i.dueDate) return false;
    if (showTodayOnly) return i.dueDate === today;
    return i.dueDate >= today && i.dueDate <= weekEnd;
  });

  // Styles
  const containerStyle = { 
    padding: '2rem', 
    fontFamily: 'Segoe UI, sans-serif', 
    backgroundColor: '#D0F0F4',
    minHeight: '100vh'
  };
  const headerStyle = { marginBottom: '2rem' };
  const titleStyle = { 
    fontSize: '1.8rem', 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: '0.5rem' 
  };
  const subtitleStyle = { 
    fontSize: '1rem', 
    color: '#666', 
    margin: 0 
  };
  const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '1.5rem' 
  };
  const cardStyle = { 
    background: '#fff', 
    borderRadius: '12px', 
    padding: '1.5rem', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    border: '1px solid #eaeaea' 
  };
  const cardTitleStyle = { 
    fontSize: '1.2rem', 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: '1rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem' 
  };
  const btnStyle = { 
    backgroundColor: '#3b82f6', 
    color: 'white', 
    padding: '0.75rem 1rem', 
    borderRadius: '8px', 
    textAlign: 'center', 
    marginBottom: '0.75rem', 
    cursor: 'pointer', 
    border: 'none', 
    fontSize: '0.95rem', 
    fontWeight: '500', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '0.5rem', 
    width: '100%', 
    transition: 'background-color 0.2s' 
  };
  const btnHoverStyle = { backgroundColor: '#2563eb' };
  const statusStyle = (status) => ({ 
    fontSize: '0.8rem', 
    padding: '0.3rem 0.6rem', 
    borderRadius: '6px', 
    marginRight: '0.5rem', 
    fontWeight: '500', 
    backgroundColor: status === 'Open' ? '#dbeafe' : '#fef3c7', 
    color: status === 'Open' ? '#1e40af' : '#92400e' 
  });
  const checkboxStyle = { 
    marginRight: '0.5rem', 
    accentColor: '#3b82f6' 
  };
  const checkboxLabelStyle = { 
    fontSize: '0.9rem', 
    color: '#555', 
    display: 'flex', 
    alignItems: 'center',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            Welcome, {getDisplayName(user)} 👋
          </h1>
          <p style={subtitleStyle}>Here's what's happening this week</p>
        </div>

        <div style={gridStyle}>
          {/* Your Boards Section */}
          <div style={cardStyle}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: '1rem' 
            }}>
              <h2 style={cardTitleStyle}>
                <span style={{ fontSize: '1.4rem' }}>🗂️</span> Your Boards
              </h2>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={showTodayOnly}
                  onChange={() => setShowTodayOnly(!showTodayOnly)}
                  style={checkboxStyle}
                />
                Show only today's
              </label>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredIssues.length > 0 ? (
                filteredIssues.map((i) => (
                  <li 
                    key={i.id} 
                    style={{ 
                      padding: '0.75rem 0', 
                      borderBottom: '1px solid #f0f0f0', 
                      display: 'flex', 
                      flexDirection: 'column' 
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start' 
                    }}>
                      <strong style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>
                        {i.title}
                      </strong>
                      <span style={statusStyle(i.status)}>{i.status}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem' }}>
                      Due: {i.dueDate}
                    </span>
                  </li>
                ))
              ) : (
                <li style={{ 
                  color: '#999', 
                  fontStyle: 'italic', 
                  padding: '1rem 0', 
                  textAlign: 'center' 
                }}>
                  No tasks found
                </li>
              )}
            </ul>
          </div>

          {/* Recently Viewed Section */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <span style={{ fontSize: '1.4rem' }}>🕵️</span> Recently Viewed
            </h2>
            <p style={{ 
              color: '#aaa', 
              fontSize: '0.9rem', 
              textAlign: 'center', 
              padding: '1rem 0' 
            }}>
              Feature coming soon
            </p>
          </div>

          {/* Quick Actions Section */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <span style={{ fontSize: '1.4rem' }}>⚡</span> Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
              <button 
                style={btnStyle} 
                onMouseOver={(e) => e.target.style.backgroundColor = btnHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = btnStyle.backgroundColor}
                onClick={() => navigate('/projects')}
              >
                <span style={{ fontSize: '1.1rem' }}>📁</span> Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
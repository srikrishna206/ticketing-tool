

//after the deployment

import React, { useEffect, useState } from 'react';
// import { listProjects, addProject, deleteProject, updateProject } from '../../services/mockApi';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiUsers, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

// Real API functions to replace mock API
const listProjects = async () => {
  try {
    const response = await fetch('http://localhost:8000/projects');
    if (response.ok) {
      const projects = await response.json();
      return projects.map(project => ({
        id: project.id.toString(),
        key: project.project_key,
        name: project.name,
        type: project.project_type,
        leads: project.leads ? project.leads.split(',').map(l => l.trim()) : [],
        team_members: project.team_members ? project.team_members.split(',').map(t => t.trim()) : [],
        description: project.description || '',
        createdAt: project.created_at,
        lastUpdated: project.updated_at
      }));
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
  return [];
};

const addProject = async (project) => {
  try {
    const payload = {
      name: project.name,
      project_key: project.key,
      project_type: project.type,
      leads: project.leads.join(', '),
      team_members: project.team_members && project.team_members.length > 0 ? project.team_members.join(', ') : null,
      description: project.description
    };
    
    console.log('Sending to backend:', payload);
    
    const response = await fetch('http://localhost:8000/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const newProject = await response.json();
      return {
        id: newProject.id.toString(),
        key: newProject.project_key,
        name: newProject.name,
        type: newProject.project_type,
        leads: newProject.leads ? newProject.leads.split(',').map(l => l.trim()) : [],
        team_members: newProject.team_members ? newProject.team_members.split(',').map(t => t.trim()) : [],
        description: newProject.description || '',
        createdAt: newProject.created_at,
        lastUpdated: newProject.updated_at
      };
    }
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

const updateProject = async (id, project) => {
  try {
    const payload = {
      name: project.name,
      project_key: project.key,
      project_type: project.type,
      leads: project.leads.join(', '),
      team_members: project.team_members && project.team_members.length > 0 ? project.team_members.join(', ') : null,
      description: project.description
    };
    
    console.log('Updating project with data:', payload);
    
    const response = await fetch(`http://localhost:8000/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const updatedProject = await response.json();
      return {
        id: updatedProject.id.toString(),
        key: updatedProject.project_key,
        name: updatedProject.name,
        type: updatedProject.project_type,
        leads: updatedProject.leads ? updatedProject.leads.split(',').map(l => l.trim()) : [],
        team_members: updatedProject.team_members ? updatedProject.team_members.split(',').map(t => t.trim()) : [],
        description: updatedProject.description || '',
        createdAt: updatedProject.created_at,
        lastUpdated: updatedProject.updated_at
      };
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

const deleteProject = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Reusable input component
function InputField({ label, value, onChange, icon: Icon, placeholder, maxLength }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DFE1E6', borderRadius: '4px', background: '#D0F0F4' }}>
        {Icon && <Icon style={{ marginLeft: '8px', color: '#6B778C' }} />}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}

// Reusable textarea component for description
function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #DFE1E6',
          borderRadius: '4px',
          outline: 'none',
          fontSize: '14px',
          background: '#D0F0F4',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('Software');
  const [leadsInput, setLeadsInput] = useState('');
  const [teamMembers, setTeamMembers] = useState([]); // Selected team members (array of emails)
  const [availableUsers, setAvailableUsers] = useState([]); // Users from user management
  const [description, setDescription] = useState(''); // Added description state
  const [expanded, setExpanded] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editType, setEditType] = useState('');
  const [editLeadsInput, setEditLeadsInput] = useState('');
  const [editTeamMembers, setEditTeamMembers] = useState([]); // Edit team members
  const [editDescription, setEditDescription] = useState(''); // Added edit description state
  const [registeredEmails, setRegisteredEmails] = useState([]); // List of registered user emails
  const [emailValidationError, setEmailValidationError] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState(null); // Track hovered card
  const [teamMembersDropdownOpen, setTeamMembersDropdownOpen] = useState(false); // Dropdown state for create
  const [editTeamMembersDropdownOpen, setEditTeamMembersDropdownOpen] = useState(false); // Dropdown state for edit

  useEffect(() => {
    loadProjects();
    loadRegisteredUsers();
  }, []);

  // Fetch registered users for email validation and team members dropdown
  const loadRegisteredUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users-management');
      if (response.ok) {
        const users = await response.json();
        const emails = users.map(user => user.email.toLowerCase());
        setRegisteredEmails(emails);
        setAvailableUsers(users); // Store full user objects for dropdown
        console.log('Loaded registered users:', users.length);
      }
    } catch (error) {
      console.error('Error loading registered users:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await listProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  // Validate that entered emails are registered
  const validateEmails = (emailsString) => {
    if (!emailsString.trim()) return { valid: true, message: '' };
    
    const emails = emailsString.split(',').map(e => e.trim().toLowerCase()).filter(e => e);
    const invalidEmails = [];
    
    for (const email of emails) {
      // Basic email format check
      if (!email.includes('@')) {
        invalidEmails.push(email);
        continue;
      }
      
      // Check if email is registered
      if (registeredEmails.length > 0 && !registeredEmails.includes(email)) {
        invalidEmails.push(email);
      }
    }
    
    if (invalidEmails.length > 0) {
      return {
        valid: false,
        message: `These emails are not registered: ${invalidEmails.join(', ')}`
      };
    }
    
    return { valid: true, message: '' };
  };

  const createProject = async () => {
    if (!name.trim()) return;
    
    // Validate emails before creating project
    const validation = validateEmails(leadsInput);
    if (!validation.valid) {
      setEmailValidationError(validation.message);
      alert(validation.message + '\n\nPlease use registered user email addresses only.');
      return;
    }
    setEmailValidationError('');
    
    const p = {
      key: key.toUpperCase() || 'PRJ',
      name,
      type,
      leads: leadsInput
        ? leadsInput.split(',').map(l => l.trim()).filter(l => l)
        : ['Unassigned'],
      team_members: teamMembers, // Include team members array
      description: description || '', // Include description
    };
    
    // Log what we're sending to help debug
    console.log('Creating project with data:', {
      name: p.name,
      leads: p.leads,
      team_members: p.team_members,
      team_members_count: p.team_members.length
    });
    
    try {
      await addProject(p);
      setName('');
      setKey('');
      setLeadsInput('');
      setTeamMembers([]); // Reset team members
      setTeamMembersDropdownOpen(false); // Close dropdown
      setType('Software');
      setDescription(''); // Reset description
      setEmailValidationError('');
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const removeProject = async (id) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditKey(p.key);
    setEditType(p.type);
    setEditLeadsInput((p.leads || []).join(', '));
    setEditTeamMembers(p.team_members || []); // Set team members for editing
    setEditDescription(p.description || ''); // Set description for editing
  };

  const saveEdit = async (id) => {
    // Validate emails before updating project
    const validation = validateEmails(editLeadsInput);
    if (!validation.valid) {
      alert(validation.message + '\n\nPlease use registered user email addresses only.');
      return;
    }
    
    const updated = {
      name: editName,
      key: editKey,
      type: editType,
      leads: editLeadsInput
        ? editLeadsInput.split(',').map(l => l.trim()).filter(l => l)
        : ['Unassigned'],
      team_members: editTeamMembers, // Include team members in update
      description: editDescription, // Save description
    };
    try {
      await updateProject(id, updated);
      setEditingId(null);
      setEditTeamMembersDropdownOpen(false); // Close dropdown after save
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  // Safe function to get leads for display
  const getLeadsDisplay = (project) => {
    if (!project.leads || !Array.isArray(project.leads)) {
      return 'Unassigned';
    }
    return project.leads.join(', ');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar create project form */}
      <div style={{ width: '320px', borderRight: '1px solid #DFE1E6', padding: '1rem', background: '#D0F0F4', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Create Project</h2>

        <InputField label="Project Name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter project name" />
        <InputField label="Project Key" value={key} onChange={e => setKey(e.target.value)} placeholder="e.g. PROJ" maxLength={10} />
        <InputField label="Project Type" value={type} onChange={e => setType(e.target.value)} placeholder="Software, Business..." />
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
            Leads (email addresses, comma separated)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DFE1E6', borderRadius: '4px', background: '#D0F0F4' }}>
            <FiUsers style={{ marginLeft: '8px', color: '#6B778C' }} />
            <input
              type="text"
              value={leadsInput}
              onChange={e => { setLeadsInput(e.target.value); setEmailValidationError(''); }}
              placeholder="user1@example.com, user2@example.com"
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                borderRadius: '4px',
              }}
            />
          </div>
          <p style={{ fontSize: '11px', color: '#6B778C', marginTop: '4px', marginBottom: 0 }}>
            ⓘ Enter registered user email addresses (not names). Email is the unique identifier.
          </p>
          {emailValidationError && (
            <p style={{ fontSize: '11px', color: '#FF5630', marginTop: '4px', marginBottom: 0 }}>
              ⚠ {emailValidationError}
            </p>
          )}
        </div>
        
        {/* Team Members Dropdown - Looks like text field */}
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
            Team Members
          </label>
          
          {/* Dropdown trigger - looks like text input */}
          <div
            onClick={() => setTeamMembersDropdownOpen(!teamMembersDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #DFE1E6',
              borderRadius: '4px',
              background: '#FFFFFF',
              cursor: 'pointer',
              minHeight: '38px',
              fontSize: '14px',
            }}
          >
            <FiUsers style={{ marginRight: '8px', color: '#6B778C', flexShrink: 0 }} />
            <div style={{ flex: 1, color: teamMembers.length === 0 ? '#6B778C' : '#172B4D' }}>
              {teamMembers.length === 0 ? (
                'Select team members...'
              ) : (
                `${teamMembers.length} member${teamMembers.length > 1 ? 's' : ''} selected`
              )}
            </div>
            <FiChevronDown style={{ color: '#6B778C', flexShrink: 0, transform: teamMembersDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>

          {/* Dropdown panel */}
          {teamMembersDropdownOpen && (
            <>
              {/* Backdrop to close dropdown when clicking outside */}
              <div
                onClick={() => setTeamMembersDropdownOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
              />
              
              {/* Dropdown content */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #DFE1E6',
                borderRadius: '4px',
                background: '#FFFFFF',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                padding: '8px'
              }}>
                {availableUsers.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#6B778C', textAlign: 'center', margin: '8px 0' }}>
                    Loading users...
                  </p>
                ) : (
                  availableUsers.map(user => (
                    <label 
                      key={user.email}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '13px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F4F5F7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={teamMembers.includes(user.email)}
                        onChange={e => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setTeamMembers([...teamMembers, user.email]);
                          } else {
                            setTeamMembers(teamMembers.filter(email => email !== user.email));
                          }
                        }}
                        style={{
                          marginRight: '8px',
                          cursor: 'pointer',
                          width: '16px',
                          height: '16px',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ flex: 1, color: '#172B4D' }}>
                        {user.first_name} {user.last_name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#6B778C', marginLeft: '8px', flexShrink: 0 }}>
                        {user.email}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </>
          )}
          
          {/* Helper text */}
          <p style={{ fontSize: '11px', color: '#6B778C', marginTop: '4px', marginBottom: 0 }}>
            ⓘ Click to select multiple team members
          </p>
        </div>
        
        {/* Added Description Field */}
        <TextAreaField 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Enter project description (optional)"
          rows={4}
        />

        <button
          onClick={createProject}
          style={{
            width: '100%',
            background: '#0052CC',
            color: 'white',
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Create Project
        </button>
      </div>

      {/* Main project list */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Projects</h2>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {(projects || []).map(p => (
            <div
              key={p.id}
              style={{
                background: '#D0F0F4',
                border: '1px solid #DFE1E6',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {editingId === p.id ? (
                <>
                  <InputField label="Name" value={editName} onChange={e => setEditName(e.target.value)} />
                  <InputField label="Key" value={editKey} onChange={e => setEditKey(e.target.value)} />
                  <InputField label="Type" value={editType} onChange={e => setEditType(e.target.value)} />
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
                      Leads (emails)
                    </label>
                    <input
                      type="text"
                      value={editLeadsInput}
                      onChange={e => setEditLeadsInput(e.target.value)}
                      placeholder="user1@example.com, user2@example.com"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #DFE1E6',
                        borderRadius: '4px',
                        outline: 'none',
                        fontSize: '14px',
                        background: '#D0F0F4',
                      }}
                    />
                    <p style={{ fontSize: '10px', color: '#6B778C', marginTop: '2px', marginBottom: 0 }}>
                      Use registered emails only
                    </p>
                  </div>
                  
                  {/* Team Members Dropdown in Edit Mode */}
                  <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
                      Team Members
                    </label>
                    
                    {/* Dropdown trigger */}
                    <div
                      onClick={() => setEditTeamMembersDropdownOpen(!editTeamMembersDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        border: '1px solid #DFE1E6',
                        borderRadius: '4px',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        minHeight: '38px',
                        fontSize: '14px',
                      }}
                    >
                      <FiUsers style={{ marginRight: '8px', color: '#6B778C', flexShrink: 0 }} />
                      <div style={{ flex: 1, color: editTeamMembers.length === 0 ? '#6B778C' : '#172B4D' }}>
                        {editTeamMembers.length === 0 ? (
                          'Select team members...'
                        ) : (
                          `${editTeamMembers.length} member${editTeamMembers.length > 1 ? 's' : ''} selected`
                        )}
                      </div>
                      <FiChevronDown style={{ color: '#6B778C', flexShrink: 0, transform: editTeamMembersDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>

                    {/* Dropdown panel */}
                    {editTeamMembersDropdownOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          onClick={() => setEditTeamMembersDropdownOpen(false)}
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999,
                          }}
                        />
                        
                        {/* Dropdown content */}
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          maxHeight: '180px',
                          overflowY: 'auto',
                          border: '1px solid #DFE1E6',
                          borderRadius: '4px',
                          background: '#FFFFFF',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          zIndex: 1000,
                          padding: '8px'
                        }}>
                          {availableUsers.length === 0 ? (
                            <p style={{ fontSize: '12px', color: '#6B778C', textAlign: 'center', margin: '8px 0' }}>
                              Loading users...
                            </p>
                          ) : (
                            availableUsers.map(user => (
                              <label 
                                key={user.email}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 8px',
                                  cursor: 'pointer',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F4F5F7'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <input
                                  type="checkbox"
                                  checked={editTeamMembers.includes(user.email)}
                                  onChange={e => {
                                    e.stopPropagation();
                                    if (e.target.checked) {
                                      setEditTeamMembers([...editTeamMembers, user.email]);
                                    } else {
                                      setEditTeamMembers(editTeamMembers.filter(email => email !== user.email));
                                    }
                                  }}
                                  style={{
                                    marginRight: '8px',
                                    cursor: 'pointer',
                                    width: '14px',
                                    height: '14px',
                                    flexShrink: 0
                                  }}
                                />
                                <span style={{ flex: 1, color: '#172B4D' }}>
                                  {user.first_name} {user.last_name}
                                </span>
                                <span style={{ fontSize: '10px', color: '#6B778C', marginLeft: '4px', flexShrink: 0 }}>
                                  {user.email}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Added Editable Description Field */}
                  <TextAreaField 
                    label="Description" 
                    value={editDescription} 
                    onChange={e => setEditDescription(e.target.value)} 
                    placeholder="Enter project description"
                    rows={3}
                  />
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => saveEdit(p.id)} style={{ background: '#36B37E', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      <FiCheck />
                    </button>
                    <button onClick={() => { setEditingId(null); setEditTeamMembersDropdownOpen(false); }} style={{ background: '#FF5630', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      <FiX />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px',
                      margin: '-8px',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                      backgroundColor: hoveredCardId === p.id ? 'rgba(0, 82, 204, 0.08)' : 'transparent'
                    }} 
                    onClick={() => navigate(`/kanban/${p.id}`)} 
                    onMouseEnter={() => setHoveredCardId(p.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    title="Click to open project board"
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#0052CC', textDecoration: hoveredCardId === p.id ? 'underline' : 'none', cursor: 'pointer' }}>
                        {p.name || 'Unnamed Project'}
                      </span>
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B778C', marginBottom: '0.5rem' }}>{p.type || 'Software'} Project</p>
                    <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Key: {p.key || 'N/A'}</p>
                    <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Leads: {getLeadsDisplay(p)}</p>
                    {p.team_members && p.team_members.length > 0 && (
                      <p style={{ fontSize: '13px', marginBottom: '0.5rem', color: '#0052CC' }}>
                        <FiUsers size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Team: {p.team_members.join(', ')}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} style={{ background: '#FFAB00', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        <FiEdit2 />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeProject(p.id); }} style={{ background: '#FF5630', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        <FiTrash2 />
                      </button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setExpanded({ ...expanded, [p.id]: !expanded[p.id] }); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0052CC' }}>
                      {expanded[p.id] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  {expanded[p.id] && (
                    <div style={{ marginTop: '0.5rem', fontSize: '13px', color: '#172B4D' }}>
                      <p>{p.description || 'No description provided.'}</p>
                    </div>
                  )}
                </>
              )}

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #EBECF0',
                  fontSize: '12px',
                  color: '#6B778C',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCalendar size={12} />
                  {p.createdAt ? (
                    <>Created {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</>
                  ) : (
                    <>Created just now</>
                  )}
                </div>
                <div>
                  {p.lastUpdated ? (
                    <>Updated {formatDistanceToNow(new Date(p.lastUpdated), { addSuffix: true })}</>
                  ) : (
                    <>Updated just now</>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(projects || []).length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem 2rem',
                background: '#fff',
                borderRadius: '8px',
                border: '1px dashed #DFE1E6',
                color: '#6B778C',
              }}
            >
              <p style={{ marginBottom: '1rem' }}>No projects yet.</p>
              <p style={{ fontSize: '14px' }}>Create your first project using the form on the left.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
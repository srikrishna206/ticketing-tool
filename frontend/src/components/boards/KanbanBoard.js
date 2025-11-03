import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const mockIssues = [
  {
    id: 'i1',
    epic: 'p1',
    epicName: 'Frontend',
    status: 'todo',
    type: 'Task',
    title: 'Setup repo',
    assignee: 'John Doe',
    storyPoints: 3,
    labels: [],
    dueDate: '2025-09-30',
    reporter: 'admin',
    priority: 'High',
    startDate: '2025-09-15',
    description: 'Setup the initial repository structure and configuration',
    subtasks: [
      { id: 'st1', title: 'Create GitHub repository', completed: true },
      { id: 'st2', title: 'Setup CI/CD pipeline', completed: false },
      { id: 'st3', title: 'Configure linting and formatting', completed: false }
    ],
    comments: 'Initial setup required for the project'
  },
  {
    id: 'i3',
    epic: 'p2',
    epicName: 'Middleware',
    status: 'todo',
    type: 'Subtask',
    title: 'API integration',
    assignee: 'Jane Smith',
    storyPoints: 2,
    labels: [],
    dueDate: '',
    reporter: 'lead-dev',
    priority: 'Low',
    startDate: '2025-09-18',
    description: 'Integrate with external API services',
    subtasks: [
      { id: 'st4', title: 'Design API endpoints', completed: true },
      { id: 'st5', title: 'Implement authentication', completed: false }
    ],
    comments: ''
  }
];

const defaultStatuses = ['backlog', 'todo', 'analysis', 'inprogress', 'blocked', 'code review', 'qa', 'milestone', 'done'];
const mockEpics = [{ id: 'p1', name: 'Frontend' }, { id: 'p2', name: 'Middleware' }];

const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 200));

// Real API functions that connect to backend
const listIssues = async (projectId) => {
  try {
    const response = await fetch('http://localhost:8000/tickets');
    if (response.ok) {
      const tickets = await response.json();
      
      // If projectId is provided, filter tickets by project through epic information
      let filteredTickets = tickets;
      if (projectId) {
        // Get epics for this project
        const epicsResponse = await fetch(`http://localhost:8000/epics?project_id=${projectId}`);
        if (epicsResponse.ok) {
          const projectEpics = await epicsResponse.json();
          const projectEpicIds = projectEpics.map(epic => epic.id.toString());
          
          // Filter tickets that belong to this project's epics
          filteredTickets = tickets.filter(ticket => {
            if (ticket.description) {
              const epicMatch = ticket.description.match(/\[EPIC:([^:]+):([^\]]+)\]/);
              if (epicMatch) {
                let epicId = epicMatch[1];
                // Remove 'p' prefix if present to normalize ID
                if (epicId.startsWith('p')) {
                  epicId = epicId.substring(1);
                }
                return projectEpicIds.includes(epicId);
              }
            }
            return false;
          });
        }
      }
      
      // Convert tickets to the format expected by the UI
      return filteredTickets.map(ticket => {
        // Map backend statuses to frontend statuses
        let mappedStatus = ticket.status.toLowerCase().replace(/\s+/g, '');
        if (mappedStatus === 'open') {
          mappedStatus = 'backlog';
        } else if (mappedStatus === 'todo') {
          mappedStatus = 'todo';
        } else if (mappedStatus === 'analysis') {
          mappedStatus = 'analysis';
        } else if (mappedStatus === 'inprogress') {
          mappedStatus = 'inprogress';
        } else if (mappedStatus === 'blocked') {
          mappedStatus = 'blocked';
        } else if (mappedStatus === 'codereview') {
          mappedStatus = 'code review';
        } else if (mappedStatus === 'qa') {
          mappedStatus = 'qa';
        } else if (mappedStatus === 'done') {
          mappedStatus = 'done';
        }
        
        // Parse epic information from description
        let epic = 'p1'; // Default to Frontend
        let epicName = 'Frontend';

        if (ticket.description) {
          const epicMatch = ticket.description.match(/\[EPIC:([^:]+):([^\]]+)\]/);
          if (epicMatch) {
            let epicId = epicMatch[1];
            // Ensure epic ID has 'p' prefix, add it if not present
            if (!epicId.startsWith('p')) {
              epic = `p${epicId}`;
            } else {
              epic = epicId;
            }
            epicName = epicMatch[2];
          }
        }
        
        // Clean description by removing epic info
        let cleanDescription = ticket.description || '';
        if (cleanDescription.includes('[EPIC:')) {
          cleanDescription = cleanDescription.replace(/\[EPIC:[^\]]+\]\s*/, '');
        }
        
        return {
          id: ticket.id.toString(),
          epic: epic,
          epicName: epicName,
          status: mappedStatus,
          type: 'Task',
          title: ticket.title,
          assignee: ticket.assignee || '',       // ✅ Load assignee from backend
          storyPoints: '',
          labels: [],
          dueDate: ticket.due_date || '',        // Load due_date from backend
          reporter: ticket.reporter || '',  // ✅ Empty string for old tickets (will be set on first save)
          priority: ticket.priority,
          startDate: ticket.start_date || '',    // Load start_date from backend
          description: cleanDescription,
          subtasks: [],
          comments: ''
        };
      });
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
  // Only return mock issues if no project is specified (fallback for general use)
  if (!projectId) {
    return mockIssues;
  }
  return []; // Return empty array for specific projects to avoid showing wrong data
};

const listProjects = async (userEmail = null) => {
  try {
    const url = userEmail 
      ? `http://localhost:8000/projects?user_email=${encodeURIComponent(userEmail)}`
      : 'http://localhost:8000/projects';
    const response = await fetch(url);
    if (response.ok) {
      const projects = await response.json();
      return projects;
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
  return [];
};

const listEpics = async (projectId) => { 
  try {
    const url = projectId ? `http://localhost:8000/epics?project_id=${projectId}` : 'http://localhost:8000/epics';
    console.log('User portal: Fetching epics from:', url);
    const response = await fetch(url);
    if (response.ok) {
      const epics = await response.json();
      console.log('User portal: Fetched epics from backend:', epics.length, epics);
      // Convert backend epics to frontend format
      const mappedEpics = epics.map(epic => ({
        id: `p${epic.id}`,
        name: epic.name,
        projectId: epic.project_id  // ✅ Include project_id for filtering!
      }));
      console.log('User portal: Mapped epics:', mappedEpics);
      return mappedEpics;
    }
  } catch (error) {
    console.error('Error fetching epics:', error);
  }
  // Return empty array if fetch failed
  console.log('User portal: Returning empty epics array');
  return [];
};

const createEpicAPI = async (epicName, projectId, userName) => {
  try {
    // Add user_name as query parameter for admin tracking
    const url = new URL('http://localhost:8000/epics');
    if (userName) {
      url.searchParams.append('user_name', userName);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: epicName,
        project_id: projectId
      }),
    });
    if (response.ok) {
      const epic = await response.json();
      return {
        id: `p${epic.id}`,
        name: epic.name
      };
    }
  } catch (error) {
    console.error('Error creating epic:', error);
  }
  // Fallback to mock creation
  const newEpic = { id: 'p' + (mockEpics.length + 1), name: epicName };
  mockEpics.push(newEpic);
  return newEpic;
};

const deleteEpicAPI = async (epicId) => {
  try {
    // Extract numeric ID from 'p1', 'p2', etc.
    const numericId = epicId.replace('p', '');
    const response = await fetch(`http://localhost:8000/epics/${numericId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error('Error deleting epic:', error);
  }
  // Fallback to mock deletion
  const epicIndex = mockEpics.findIndex(epic => epic.id === epicId);
  if (epicIndex > -1) mockEpics.splice(epicIndex, 1);
  return true;
};

const moveIssue = async (issueId, status) => {
  try {
    // Map frontend statuses to backend statuses
    let backendStatus = status;
    if (status === 'backlog') {
      backendStatus = 'Open';
    } else if (status === 'todo') {
      backendStatus = 'Todo';
    } else if (status === 'analysis') {
      backendStatus = 'Analysis';
    } else if (status === 'inprogress') {
      backendStatus = 'In Progress';
    } else if (status === 'blocked') {
      backendStatus = 'Blocked';
    } else if (status === 'code review') {
      backendStatus = 'Code review';
    } else if (status === 'qa') {
      backendStatus = 'QA';
    } else if (status === 'done') {
      backendStatus = 'Done';
    } else {
      // Default: capitalize first letter
      backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    const response = await fetch(`http://localhost:8000/tickets/${issueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: backendStatus
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

const createIssueAPI = async (issue, projectId, userName) => { 
  try {
    // Store epic information in the description
    // Remove 'p' prefix from epic ID if present
    const epicId = issue.epic.toString().startsWith('p') ? issue.epic.substring(1) : issue.epic;
    const epicInfo = `[EPIC:${epicId}:${issue.epicName}]`;
    const description = issue.description ? `${epicInfo} ${issue.description}` : epicInfo;
    
    // Get or create user ID for the logged-in user
    let userId = 1; // Default fallback
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = currentUser.email || userName;
      
      if (userEmail) {
        // Try to get user from users table by email
        const usersResponse = await fetch(`http://localhost:8000/users-by-email/${encodeURIComponent(userEmail)}`);
        
        if (usersResponse.ok) {
          const user = await usersResponse.json();
          userId = user.id;
          console.log('Using existing user ID:', userId);
        } else {
          // User doesn't exist in users table, create one
          console.log('User not found, creating user with email:', userEmail);
          const createUserResponse = await fetch('http://localhost:8000/users-simple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              name: currentUser.name || userEmail.split('@')[0]
            })
          });
          
          if (createUserResponse.ok) {
            const newUser = await createUserResponse.json();
            userId = newUser.id;
            console.log('Created new user with ID:', userId);
          }
        }
      }
    } catch (userError) {
      console.warn('Error getting/creating user, using default user_id:', userError);
    }
    
    // Add query parameters for admin tracking
    const url = new URL('http://localhost:8000/tickets');
    if (epicId) {
      url.searchParams.append('epic_id', epicId);
    }
    if (projectId) {
      url.searchParams.append('project_id', projectId);
    }
    if (userName) {
      url.searchParams.append('user_name', userName);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId, // ✅ Valid user ID from database
        title: issue.title,
        description: description,
        status: 'Open',
        priority: issue.priority || 'Medium',
        assignee: issue.assignee || null,      // Include assignee
        reporter: issue.reporter || null,      // Include reporter
        start_date: issue.startDate || null,  // Include start date
        due_date: issue.dueDate || null        // Include due date
      }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ticket creation failed:', errorData);
      throw new Error(`Failed to create ticket: ${errorData}`);
    }
    console.log('Ticket created with dates');
    return await response.json();
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

const deleteIssueAPI = async (issueId) => { 
  try {
    const response = await fetch(`http://localhost:8000/tickets/${issueId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ticket');
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

const updateIssueAPI = async (updatedIssue) => { 
  try {
    // Map frontend statuses to backend statuses
    let backendStatus = updatedIssue.status;
    if (updatedIssue.status === 'backlog') {
      backendStatus = 'Open';
    } else if (updatedIssue.status === 'todo') {
      backendStatus = 'Todo';
    } else if (updatedIssue.status === 'analysis') {
      backendStatus = 'Analysis';
    } else if (updatedIssue.status === 'inprogress') {
      backendStatus = 'In Progress';
    } else if (updatedIssue.status === 'blocked') {
      backendStatus = 'Blocked';
    } else if (updatedIssue.status === 'code review') {
      backendStatus = 'Code review';
    } else if (updatedIssue.status === 'qa') {
      backendStatus = 'QA';
    } else if (updatedIssue.status === 'done') {
      backendStatus = 'Done';
    } else {
      // Default: capitalize first letter
      backendStatus = updatedIssue.status.charAt(0).toUpperCase() + updatedIssue.status.slice(1);
    }
    
    // Preserve epic information in description
    let description = updatedIssue.description || '';
    if (updatedIssue.epic && updatedIssue.epicName) {
      const epicInfo = `[EPIC:${updatedIssue.epic}:${updatedIssue.epicName}]`;
      // Remove existing epic info if present
      description = description.replace(/\[EPIC:[^\]]+\]\s*/, '');
      // Add new epic info
      description = `${epicInfo} ${description}`.trim();
    }
    
    const response = await fetch(`http://localhost:8000/tickets/${updatedIssue.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: updatedIssue.title,
        description: description,
        status: backendStatus,
        priority: updatedIssue.priority,
        assignee: updatedIssue.assignee || null,      // Include assignee
        reporter: updatedIssue.reporter || null,      // Include reporter
        start_date: updatedIssue.startDate || null,  // Include start date
        due_date: updatedIssue.dueDate || null        // Include due date
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }
    console.log('Ticket updated with dates:', updatedIssue.id);
    return await response.json();
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

const getSwimlanes = (issues, epics) =>
  epics.map(epic => {
    const epicIssues = issues.filter(i => (i.epic || i.projectId) === epic.id);
    return { id: epic.id, title: epic.name, issues: epicIssues };
  });

const getProjectName = (projectId, epics) => {
  const project = epics.find(p => p.id === projectId);
  return project ? project.name : 'Untitled Project';
};

export default function KanbanBoard() {
  const { name } = useParams();
  const { user } = useAuth(); // Get logged-in user for admin tracking
  const [issues, setIssues] = useState([]);
  const [epics, setEpics] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openSwimlanes, setOpenSwimlanes] = useState({});
  const [customTitles, setCustomTitles] = useState({});
  const [createLaneId, setCreateLaneId] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskType, setNewTaskType] = useState('Task');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [showCreateEpic, setShowCreateEpic] = useState(false);
  const [showDeleteEpic, setShowDeleteEpic] = useState(false);
  const [newEpicName, setNewEpicName] = useState('');
  const [epicToDelete, setEpicToDelete] = useState('');
  const [selectedProjectForEpic, setSelectedProjectForEpic] = useState(null);
  const [columnsByLane, setColumnsByLane] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [hoveredAssigneeId, setHoveredAssigneeId] = useState(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(null); // Project filter dropdown

  // Handler for file input changes
  const handleNewUserChange = (event) => {
    const file = event.target.files[0];
    setProfileFile(file);
  };

  // Subtask management
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get current user email
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userEmail = currentUser.email;
        
        console.log('User portal: Current user email:', userEmail);
        
        // Fetch projects for this user (as lead OR team member) - backend filters automatically
        const projectsData = await listProjects(userEmail);
        setProjects(projectsData);
        
        console.log('User portal: Available projects (lead or team member):', projectsData.map(p => ({ name: p.name, leads: p.leads, team_members: p.team_members })));
        
        // All projects in projectsData are now user's projects (no need to filter again)
        let userProjects = projectsData;
        
        // Set first project as current (for display name), but load data from ALL projects
        const project = userProjects.length > 0 ? userProjects[0] : null;
        setCurrentProject(project);
        
        let issuesData, epicsData;
        
        // Load epics and tickets from ALL projects the user is assigned to
        if (userProjects.length > 0) {
          // Load ALL epics and tickets from ALL user's projects
          console.log('User portal: Loading data from ALL assigned projects');
          [issuesData, epicsData] = await Promise.all([
            listIssues(null), // null = fetch ALL tickets
            listEpics()       // Fetch ALL epics
          ]);
          
          // Filter to only show epics and tickets from user's assigned projects
          const userProjectIds = userProjects.map(p => p.id);
          const validProjectIdsSet = new Set(userProjectIds); // Create Set for faster lookup
          
          console.log('User portal: User project IDs:', userProjectIds);
          console.log('User portal: Total epics fetched:', epicsData.length);
          console.log('User portal: Epic details BEFORE filtering:', epicsData.map(e => ({ id: e.id, name: e.name, projectId: e.projectId })));
          
          // Filter epics to only those belonging to user's projects (remove orphaned epics)
          const filteredEpics = epicsData.filter(epic => {
            // Remove epics without projectId
            if (!epic.projectId) {
              console.warn('User portal: Epic without projectId found:', epic);
              return false;
            }
            // Remove epics whose projects don't exist in user's projects
            const isInUserProjects = validProjectIdsSet.has(epic.projectId);
            if (!isInUserProjects) {
              console.warn('User portal: Removing epic from non-user project:', epic.id, epic.name, 'Project ID:', epic.projectId);
            }
            return isInUserProjects;
          });
          epicsData = filteredEpics;
          console.log('User portal: Filtered to', epicsData.length, 'epics from user projects:', epicsData.map(e => e.name));
          
          // Filter tickets to only those belonging to user's project epics (remove orphaned tickets)
          const userEpicIds = epicsData.map(e => e.id);
          const validEpicIdsSet = new Set(userEpicIds); // Create Set for faster lookup
          
          const filteredIssues = issuesData.filter(ticket => {
            if (!ticket.epic && !ticket.projectId) {
              console.warn('User portal: Ticket without epic/projectId found:', ticket);
              return false;
            }
            const epicId = ticket.epic || ticket.projectId;
            const isValid = validEpicIdsSet.has(epicId);
            if (!isValid) {
              console.warn('User portal: Removing orphaned ticket:', ticket.id, ticket.title, 'Epic ID:', epicId);
            }
            return isValid;
          });
          issuesData = filteredIssues;
          console.log('User portal: Filtered to', issuesData.length, 'tickets from user epics');
        } else {
          // If no projects assigned, show empty
          console.log('User portal: No projects assigned to user');
          issuesData = [];
          epicsData = [];
        }
        
        setIssues(issuesData);
        setEpics(epicsData);
        
        // Initialize open swimlanes and custom titles
        const initialOpenSwimlanes = {};
        const initialCustomTitles = {};
        const initialColumnsByLane = {};
        
        epicsData.forEach(epic => {
          initialOpenSwimlanes[epic.id] = true;
          initialCustomTitles[epic.id] = epic.name;
          initialColumnsByLane[epic.id] = defaultStatuses.slice();
        });
        
        setOpenSwimlanes(initialOpenSwimlanes);
        setCustomTitles(initialCustomTitles);
        setColumnsByLane(initialColumnsByLane);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [name]);

  // Subtask functions
  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;

    const newSubtask = {
      id: `st${Date.now()}`,
      title: newSubtaskText.trim(),
      completed: false
    };

    setEditIssue(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask]
    }));

    setNewSubtaskText('');
  };

  const removeSubtask = (subtaskId) => {
    setEditIssue(prev => ({
      ...prev,
      subtasks: (prev.subtasks || []).filter(st => st.id !== subtaskId)
    }));
  };

  const toggleSubtask = (subtaskId) => {
    setEditIssue(prev => ({
      ...prev,
      subtasks: (prev.subtasks || []).map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  const handleSubtaskKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtask();
    }
  };

  // Modal drag functionality
  const [modalDrag, setModalDrag] = useState({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    position: { x: 0, y: 0 }
  });

  const handleModalMouseDown = (e) => {
    if (isMobile) return;
    setModalDrag({
      isDragging: true,
      startPosition: { x: e.clientX - modalDrag.position.x, y: e.clientY - modalDrag.position.y },
      position: modalDrag.position
    });
  };

  const handleModalMouseMove = (e) => {
    if (!modalDrag.isDragging || isMobile) return;

    const newX = e.clientX - modalDrag.startPosition.x;
    const newY = e.clientY - modalDrag.startPosition.y;

    setModalDrag(prev => ({
      ...prev,
      position: { x: newX, y: newY }
    }));
  };

  const handleModalMouseUp = () => {
    setModalDrag(prev => ({ ...prev, isDragging: false }));
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (modalDrag.isDragging) {
      document.addEventListener('mousemove', handleModalMouseMove);
      document.addEventListener('mouseup', handleModalMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleModalMouseMove);
      document.removeEventListener('mouseup', handleModalMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [modalDrag.isDragging]);

  const openAddColumnModal = (e, laneId, colIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    setColumnModal({ laneId, colIndex, type: 'add' });
    setColumnInput('');
  };

  const openEditColumnModal = (e, laneId, colIndex, status) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    setColumnModal({ laneId, colIndex, type: 'menu', status });
    setColumnInput(status);
  };

  const handleAddColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert('Column name is required');

    setColumnsByLane(prev => {
      const newColumns = [...(prev[columnModal.laneId] || [])];
      newColumns.splice(columnModal.colIndex + 1, 0, name.toLowerCase().replace(/\s+/g, ''));
      return { ...prev, [columnModal.laneId]: newColumns };
    });

    setColumnModal(null);
    setColumnInput('');
  };

  const handleDeleteColumn = () => {
    if (columnsByLane[columnModal.laneId].length <= 1) {
      return alert('Cannot delete the last column');
    }

    setColumnsByLane(prev => {
      const newColumns = [...(prev[columnModal.laneId] || [])];
      newColumns.splice(columnModal.colIndex, 1);
      return { ...prev, [columnModal.laneId]: newColumns };
    });

    setColumnModal(null);
    setColumnInput('');
  };

  const handleRenameColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert('Column name is required');

    setColumnsByLane(prev => {
      const newColumns = [...(prev[columnModal.laneId] || [])];
      newColumns[columnModal.colIndex] = name.toLowerCase().replace(/\s+/g, '');
      return { ...prev, [columnModal.laneId]: newColumns };
    });

    setColumnModal(null);
    setColumnInput('');
  };

  const [columnModal, setColumnModal] = useState(null);
  const [columnInput, setColumnInput] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const onDragStart = (e, issue) => {
    e.dataTransfer.setData('text/plain', issue.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = e => e.preventDefault();

  const handleCreateClick = laneId => { setCreateLaneId(laneId); setNewTaskText(''); setNewTaskType('Task'); };
  const handleCreateSubmit = async lane => {
    if (!newTaskText.trim()) { alert('Task title is required'); return; }
    
    // Get current user email as reporter
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const reporterEmail = currentUser.email || 'system';
    
    const newIssue = {
      id: Math.random().toString(36).slice(2),
      epic: lane.id,
      projectId: lane.id,
      epicName: lane.title,
      title: newTaskText,
      status: 'backlog',
      assignee: '',
      type: newTaskType,
      storyPoints: '',
      labels: [],
      dueDate: '',
      reporter: reporterEmail,  // Set to current user's email
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      description: '',
      subtasks: [],
      comments: ''
    };
    try {
      await createIssueAPI(newIssue, currentProject?.id, user?.email);
      const refreshed = await listIssues(currentProject ? currentProject.id : null);
      setIssues(refreshed);
      setCreateLaneId(null);
    } catch (err) { console.error(err); }
  };

  const handleIssueClick = (issue) => {
    // Don't auto-change reporter when just opening - preserve existing value
    // The reporter should remain whoever originally assigned/created the ticket
    setSelectedIssue(issue);
    setEditIssue({ ...issue });
    setNewSubtaskText('');
    // Reset position when opening new modal
    setModalDrag({
      isDragging: false,
      startPosition: { x: 0, y: 0 },
      position: { x: 0, y: 0 }
    });
  };

  // Helper function to get all assignable users (lead + team members) for an issue
  const getAssignableUsers = (issue) => {
    if (!issue || !issue.epic) return [];
    
    // Find the epic this issue belongs to
    const epic = epics.find(e => e.id === issue.epic);
    if (!epic || !epic.projectId) return [];
    
    // Find the project this epic belongs to
    const project = projects.find(p => p.id === epic.projectId);
    if (!project) return [];
    
    // Collect all assignable users (lead + team members)
    const assignableUsers = [];
    
    // Add leads (could be multiple, comma-separated)
    if (project.leads) {
      const leads = project.leads.split(',').map(email => email.trim()).filter(email => email);
      assignableUsers.push(...leads);
    }
    
    // Add team members (comma-separated)
    if (project.team_members) {
      const teamMembers = project.team_members.split(',').map(email => email.trim()).filter(email => email);
      assignableUsers.push(...teamMembers);
    }
    
    // Remove duplicates and return
    return [...new Set(assignableUsers)];
  };

  const handleSave = async () => {
    try {
      // For old tickets without reporter, set it to current user when saving
      if (!editIssue.reporter || editIssue.reporter === '' || editIssue.reporter === '(Not set)') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const reporterEmail = currentUser.email || 'system';
        editIssue.reporter = reporterEmail;
        console.log('Auto-setting reporter for old ticket:', reporterEmail);
      }
      await updateIssueAPI(editIssue);
      const refreshed = await listIssues(currentProject ? currentProject.id : null);
      setIssues(refreshed);
      setSelectedIssue(null);
      setEditIssue(null);
    } catch (err) {
      console.error('Error saving issue:', err);
    }
  };

  const handleReset = () => { setEditIssue({ ...selectedIssue }); };

  const handleCreateEpic = async () => {
    if (!newEpicName.trim()) {
      alert('Epic name is required');
      return;
    }
    if (!selectedProjectForEpic) {
      alert('Please select a project for this epic.');
      return;
    }
    try {
      await createEpicAPI(newEpicName, selectedProjectForEpic.id, user?.email);
      // Refresh ALL epics and issues to ensure new epic appears
      const [updatedEpics, updatedIssues] = await Promise.all([
        listEpics(), // Fetch ALL epics
        listIssues(null) // Fetch ALL tickets
      ]);
      
      // Filter to user's projects (as lead OR team member)
      const userEmail = user?.email?.toLowerCase();
      const userProjects = projects.filter(p => {
        const isLead = p.leads && p.leads.toLowerCase().includes(userEmail);
        const isTeamMember = p.team_members && p.team_members.toLowerCase().includes(userEmail);
        return isLead || isTeamMember;
      });
      const userProjectIds = userProjects.map(p => p.id);
      
      const filteredEpics = updatedEpics.filter(epic => 
        epic.projectId && userProjectIds.includes(epic.projectId)
      );
      const userEpicIds = filteredEpics.map(e => e.id);
      const filteredIssues = updatedIssues.filter(ticket => 
        ticket.epic && userEpicIds.includes(ticket.epic)
      );
      
      console.log('Updated epics after creation:', filteredEpics);
      
      setEpics(filteredEpics);
      setIssues(filteredIssues);
      
      // Initialize board structure for all epics (including new ones)
      const newOpenSwimlanes = {};
      const newCustomTitles = {};
      const newColumnsByLane = {};
      
      updatedEpics.forEach(epic => {
        newOpenSwimlanes[epic.id] = openSwimlanes[epic.id] !== undefined ? openSwimlanes[epic.id] : true;
        newCustomTitles[epic.id] = customTitles[epic.id] || epic.name;
        newColumnsByLane[epic.id] = columnsByLane[epic.id] || defaultStatuses.slice();
        console.log(`Initialized epic ${epic.id} (${epic.name}) with ${newColumnsByLane[epic.id].length} columns`);
      });
      
      console.log('New openSwimlanes:', newOpenSwimlanes);
      console.log('New columnsByLane:', newColumnsByLane);
      
      setOpenSwimlanes(newOpenSwimlanes);
      setCustomTitles(newCustomTitles);
      setColumnsByLane(newColumnsByLane);
      
      setNewEpicName('');
      setSelectedProjectForEpic(null);
      setShowCreateEpic(false);
    } catch (error) {
      console.error('Error creating epic:', error);
    }
  };

  const handleDeleteEpic = async () => {
    if (!epicToDelete) {
      alert('Please select an epic to delete');
      return;
    }
    try {
      await deleteEpicAPI(epicToDelete);
      // Refresh both epics and issues after deletion
      const [updatedEpics, updatedIssues] = await Promise.all([
        listEpics(currentProject ? currentProject.id : null),
        listIssues(currentProject ? currentProject.id : null)
      ]);
      setEpics(updatedEpics);
      setIssues(updatedIssues);
      setEpicToDelete('');
      setShowDeleteEpic(false);
      // Remove from open swimlanes and custom titles
      setOpenSwimlanes(prev => {
        const newOpenSwimlanes = { ...prev };
        delete newOpenSwimlanes[epicToDelete];
        return newOpenSwimlanes;
      });
      setCustomTitles(prev => {
        const newCustomTitles = { ...prev };
        delete newCustomTitles[epicToDelete];
        return newCustomTitles;
      });
      setColumnsByLane(prev => {
        const newColumnsByLane = { ...prev };
        delete newColumnsByLane[epicToDelete];
        return newColumnsByLane;
      });
    } catch (error) {
      console.error('Error deleting epic:', error);
    }
  };

  const handleDeleteIssue = async () => {
    if (!selectedIssue) return;
    try {
      await deleteIssueAPI(selectedIssue.id);
      const refreshed = await listIssues(currentProject ? currentProject.id : null);
      setIssues(refreshed);
      setSelectedIssue(null);
      setEditIssue(null);
    } catch (err) {
      console.error('Error deleting issue:', err);
    }
  };

  const onDrop = async (e, status, laneId) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain');
    const issue = issues.find(i => i.id === issueId);
    if (issue && issue.status !== status) {
      try {
        await moveIssue(issueId, status);
        const refreshed = await listIssues(currentProject ? currentProject.id : null);
        setIssues(refreshed);
      } catch (err) {
        console.error('Error moving issue:', err);
      }
    }
  };

  const byStatus = (collection, status) => collection.filter(i => i.status === status);

  const toggleSwimlane = (laneId) => {
    setOpenSwimlanes(prev => ({ ...prev, [laneId]: !prev[laneId] }));
  };

  const updateCustomTitle = (laneId, newTitle) => {
    setCustomTitles(prev => ({ ...prev, [laneId]: newTitle }));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading board...
      </div>
    );
  }

  // Filter epics and issues based on selected project
  const filteredEpics = selectedProjectFilter 
    ? epics.filter(epic => epic.projectId === selectedProjectFilter)
    : epics;
  
  const filteredIssues = selectedProjectFilter
    ? issues.filter(issue => {
        // Check if issue belongs to any epic of the selected project
        const epic = epics.find(e => e.id === issue.epic);
        return epic && epic.projectId === selectedProjectFilter;
      })
    : issues;
  
  const swimlanes = getSwimlanes(filteredIssues, filteredEpics);

  return (
    <div className="board-wrap">
      {/* Project Filter Dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: '#FFFFFF',
        borderBottom: '2px solid #DFE1E6',
        marginBottom: '16px'
      }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: '#172B4D', marginRight: '8px' }}>
          Filter by Project:
        </label>
        <select
          value={selectedProjectFilter || ''}
          onChange={(e) => setSelectedProjectFilter(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '8px 12px',
            border: '1px solid #DFE1E6',
            borderRadius: '4px',
            fontSize: '14px',
            background: '#FFFFFF',
            cursor: 'pointer',
            minWidth: '250px',
            outline: 'none',
          }}
        >
          <option value="">All Projects ({projects.length})</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {selectedProjectFilter && (
          <button
            onClick={() => setSelectedProjectFilter(null)}
            style={{
              padding: '6px 12px',
              background: '#FFAB00',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div style={{
        padding: '0 20px 16px 20px',
        fontSize: '14px',
        color: '#6B778C',
        fontWeight: 500
      }}>
        Showing {filteredEpics.length} epic{filteredEpics.length !== 1 ? 's' : ''} - {filteredIssues.length} ticket{filteredIssues.length !== 1 ? 's' : ''}
      </div>

      {/* Epic management buttons */}
      <div className="epic-management-section">
        {currentProject && (
          <p style={{
            fontSize: '16px',
            color: '#5e6c84',
            margin: '0 0 20px 0',
            fontWeight: '500',
            display: 'none'
          }}>
            {(() => {
              const userEmail = user?.email?.toLowerCase();
              const userProjects = projects.filter(p => {
                const isLead = p.leads && p.leads.toLowerCase().includes(userEmail);
                const isTeamMember = p.team_members && p.team_members.toLowerCase().includes(userEmail);
                return isLead || isTeamMember;
              });
              return userProjects.length > 1 
                ? `Showing all your projects (${userProjects.length})` 
                : `${currentProject.name} Board`;
            })()}
          </p>
        )}
        <div className="epic-buttons-container">
          <button className="create-epic-btn" onClick={() => { setShowCreateEpic(true); setShowDeleteEpic(false); }}>+ Create Epic</button>
          <button className="delete-epic-btn" onClick={() => { setShowDeleteEpic(true); setShowCreateEpic(false); }}>🗑 Delete Epic</button>
        </div>

        {/* Create Epic Modal */}
        {showCreateEpic && (
          <div className="epic-modal-overlay" onClick={() => setShowCreateEpic(false)}>
            <div className="epic-modal" onClick={e => e.stopPropagation()}>
              <div className="epic-modal-content">
                <h3>Create New Epic</h3>
                <input type="text" placeholder="Enter epic name" value={newEpicName} onChange={(e) => setNewEpicName(e.target.value)} className="epic-modal-input" autoFocus />
                <select 
                  value={selectedProjectForEpic?.id || ''} 
                  onChange={(e) => {
                    const project = projects.find(p => p.id == e.target.value);
                    setSelectedProjectForEpic(project);
                  }} 
                  className="epic-modal-select"
                  style={{ marginTop: '10px' }}
                >
                  <option value="">Select Project...</option>
                  {projects.filter(p => {
                    const userEmail = user?.email?.toLowerCase();
                    const isLead = p.leads && p.leads.toLowerCase().includes(userEmail);
                    const isTeamMember = p.team_members && p.team_members.toLowerCase().includes(userEmail);
                    return isLead || isTeamMember;
                  }).map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <div className="epic-modal-actions">
                  <button className="btn-cancel" onClick={() => { setShowCreateEpic(false); setNewEpicName(''); setSelectedProjectForEpic(null); }}>Cancel</button>
                  <button className="btn-create" onClick={handleCreateEpic}>Create Epic</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Epic Modal */}
        {showDeleteEpic && (
          <div className="epic-modal-overlay" onClick={() => setShowDeleteEpic(false)}>
            <div className="epic-modal" onClick={e => e.stopPropagation()}>
              <div className="epic-modal-content">
                <h3>Delete Epic</h3>
                <p className="delete-warning">Select an epic to delete. This will also delete all issues in the epic.</p>
                <select value={epicToDelete} onChange={(e) => setEpicToDelete(e.target.value)} className="epic-modal-select">
                  <option value="">Select an epic...</option>
                  {epics.map(epic => (
                    <option key={epic.id} value={epic.id}>{epic.name} ({swimlanes.find(s => s.id === epic.id)?.issues.length || 0} issues)</option>
                  ))}
                </select>
                <div className="epic-modal-actions">
                  <button className="btn-cancel" onClick={() => { setShowDeleteEpic(false); setEpicToDelete(''); }}>Cancel</button>
                  <button className="btn-delete" onClick={handleDeleteEpic} disabled={!epicToDelete}>Delete Epic</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Swimlanes and columns */}
      {swimlanes.map(lane => {
        const isOpen = openSwimlanes[lane.id];
        const statuses = columnsByLane[lane.id] || defaultStatuses;
        // Find the epic to get project name
        const epic = epics.find(e => e.id === lane.id);
        const epicProject = epic?.projectId ? projects.find(p => p.id === epic.projectId) : null;
        
        return (
          <section className="swimlane" key={lane.id}>
            <header className="swimlane-header">
              <button className="swimlane-toggle" onClick={() => toggleSwimlane(lane.id)}>{isOpen ? '▼' : '▶'}</button>
              <span className="swimlane-icon">⚡</span>
              <input className="swimlane-title-input" value={customTitles[lane.id] || ''} onChange={e => setCustomTitles(prev => ({ ...prev, [lane.id]: e.target.value }))} />
              {epicProject && (
                <span style={{
                  fontSize: '12px',
                  color: '#5e6c84',
                  background: '#f0f9ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginRight: '8px',
                  fontWeight: '500'
                }}>
                  📁 {epicProject.name}
                </span>
              )}
              <span className="swimlane-count">{lane.issues.length} work items</span>
            </header>
            {isOpen && (
              <div className="kanban-row">
                {statuses.map((status, idx) => {
                  const issuesForStatus = byStatus(lane.issues, status);
                  return (
                    <div className="kanban-column" key={status} onDragOver={onDragOver} onDrop={e => onDrop(e, status, lane.id)}>
                      <div className="col-header">
                        <span className="col-title">{status.toUpperCase()}</span>
                        <span className="col-icons">
                          <button className="col-icon" title="Add Column" onClick={e => openAddColumnModal(e, lane.id, idx)}>＋</button>
                          <button className="col-icon" title="Edit/Delete Column" onClick={e => openEditColumnModal(e, lane.id, idx, status)}>⋮</button>
                        </span>
                        {issuesForStatus.length > 0 && <span className="col-count">{issuesForStatus.length}</span>}
                      </div>
                      <div className="col-create">
                        {status === 'backlog' && (
                          createLaneId === lane.id ? (
                            <div className="create-card">
                              <textarea rows={2} className="create-input" placeholder="What needs to be done?" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} />
                              <div className="create-actions">
                                <select value={newTaskType} onChange={e => setNewTaskType(e.target.value)} className="create-select">
                                  <option>Task</option><option>Subtask</option><option>Bug</option>
                                </select>
                                <button className="create-btn" onClick={() => handleCreateSubmit(lane)}>✔</button>
                                <button className="create-btn" onClick={() => setCreateLaneId(null)}>✖</button>
                              </div>
                            </div>
                          ) : (<span className="create-link" onClick={() => handleCreateClick(lane.id)}>+ Create</span>)
                        )}
                      </div>
                      {issuesForStatus.map(issue => {
                        const isHovered = hoveredAssigneeId === issue.id;
                        return (
                          <div className="card-item" key={issue.id} draggable onDragStart={e => onDragStart(e, issue)} onClick={() => handleIssueClick(issue)}>
                            <div className="card-top">
                              <span className={`card-tag card-tag-${issue.type.toLowerCase()}`}>{issue.type}</span>
                              <span className="card-id">#{issue.id}</span>
                            </div>
                            <div className="card-title">{issue.title}</div>
                            <div className="card-meta">
                              {issue.dueDate && <span className="card-due">📅 {issue.dueDate}</span>}
                              <span className={`card-priority ${issue.priority.toLowerCase()}`}>⚑ {issue.priority}</span>
                              {issue.assignee && (
                                <span className="card-assignee" style={{ fontSize: '12px', color: '#5e6c84', marginLeft: '8px' }}>
                                  👤 {issue.assignee}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          )}
          </section>
        );
      })}

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              width: '90vw',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              transform: `translate(${modalDrag.position.x}px, ${modalDrag.position.y}px)`
            }}
            onMouseDown={handleModalMouseDown}
          >
            <button
              onClick={() => { setSelectedIssue(null); setEditIssue(null); }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>

            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
              {editIssue?.title || selectedIssue.title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Title</label>
                <input
                  type="text"
                  value={editIssue?.title || ''}
                  onChange={(e) => setEditIssue(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Status</label>
                <select
                  value={editIssue?.status || ''}
                  onChange={(e) => setEditIssue(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="analysis">Analysis</option>
                  <option value="inprogress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="code review">Code Review</option>
                  <option value="qa">QA</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Priority</label>
                <select
                  value={editIssue?.priority || ''}
                  onChange={(e) => setEditIssue(prev => ({ ...prev, priority: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Assignee</label>
                <select
                  value={editIssue?.assignee || ''}
                  onChange={(e) => {
                    const newAssignee = e.target.value;
                    setEditIssue(prev => {
                      // If assignee is being changed AND it's an actual change, update reporter
                      if (newAssignee && prev.assignee && newAssignee !== prev.assignee) {
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        console.log(`Assignee changed from "${prev.assignee}" to "${newAssignee}", reporter set to: ${currentUser.email}`);
                        return { ...prev, assignee: newAssignee, reporter: currentUser.email || prev.reporter };
                      }
                      return { ...prev, assignee: newAssignee };
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select assignee...</option>
                  {getAssignableUsers(editIssue).map(userEmail => (
                    <option key={userEmail} value={userEmail}>{userEmail}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Start Date</label>
                <input
                  type="date"
                  value={editIssue?.startDate || ''}
                  onChange={(e) => setEditIssue(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Due Date</label>
                <input
                  type="date"
                  value={editIssue?.dueDate || ''}
                  onChange={(e) => setEditIssue(prev => ({ ...prev, dueDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description</label>
              <textarea
                value={editIssue?.description || ''}
                onChange={(e) => setEditIssue(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  height: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Comments</label>
              <textarea
                value={editIssue?.comments || ''}
                onChange={(e) => setEditIssue(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Add comments..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  height: '60px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Subtasks */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Subtasks</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyPress={handleSubtaskKeyPress}
                  placeholder="Add subtask..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(editIssue?.subtasks || []).map(subtask => (
                  <div key={subtask.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px',
                    background: '#f9fafb',
                    borderRadius: '6px'
                  }}>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ 
                      flex: 1, 
                      textDecoration: subtask.completed ? 'line-through' : 'none',
                      color: subtask.completed ? '#6b7280' : '#1f2937'
                    }}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => removeSubtask(subtask.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset
              </button>
              <button
                onClick={handleDeleteIssue}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column Add/Edit modal */}
      {columnModal && (columnModal.type === 'add' || columnModal.type === 'menu') && (
        <div className="epic-modal-overlay" onClick={() => setColumnModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="epic-modal" onClick={e => e.stopPropagation()} style={{
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            minWidth: isMobile ? '90vw' : 280,
            maxWidth: isMobile ? '95vw' : 320,
            padding: 20,
            borderRadius: 10,
          }}>
            {columnModal.type === 'add' ? (
              <>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Add Column</h4>
                <input
                  type="text"
                  value={columnInput}
                  onChange={(e) => setColumnInput(e.target.value)}
                  placeholder="Column name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setColumnModal(null)} style={styles.cancel}>Cancel</button>
                  <button onClick={handleAddColumn} style={styles.create}>Add</button>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Column Actions</h4>
                <input
                  type="text"
                  value={columnInput}
                  onChange={(e) => setColumnInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setColumnModal(null)} style={styles.cancel}>Cancel</button>
                  <button onClick={handleDeleteColumn} style={styles.delete}>Delete</button>
                  <button onClick={handleRenameColumn} style={styles.create}>Rename</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Complete admin portal styling */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f6f8;
        }
        .board-wrap {
          max-width: 100%;
          overflow-x: auto;
        }
        .epic-management-section {
          padding: 20px;
          margin-bottom: 20px;
        }
        .epic-buttons-container {
          display: flex;
          gap: 12px;
        }
        .swimlane {
          background: white;
          border-radius: 8px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .swimlane-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #D0F0F4;
          border-bottom: 1px solid #dfe5e5;
          font-weight: 600;
          font-size: 14px;
          color: #172b4d;
        }
        .swimlane-toggle {
          border: none;
          background: transparent;
          font-size: 14px;
          color: #5e6c84;
          margin-right: 8px;
          cursor: pointer;
        }
        .swimlane-icon {
          font-size: 18px;
          color: #5e6c84;
          margin-right: 8px;
        }
        .swimlane-title-input {
          border: 1px solid #dfe5e5;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 14px;
          font-weight: 600;
          background: white;
          margin-right: 8px;
          min-width: 150px;
          color: #172b4d;
        }
        .swimlane-title-input:focus {
          outline: none;
          border-color: #1976d2;
        }
        .swimlane-count {
          color: #5e6c84;
          font-size: 12px;
          font-weight: normal;
          user-select: none;
        }
        .kanban-row {
          display: flex;
          padding: 16px;
          gap: 12px;
          overflow-x: auto;
        }
        .kanban-column {
          flex: 0 0 260px;
          background: #D0F0F4;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid #dfe5e5;
          user-select: none;
        }
        .col-header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          gap: 6px;
        }
        .col-title {
          font-weight: 600;
          font-size: 12px;
          color: #5e6c84;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-grow: 1;
          user-select: none;
        }
        .col-count {
          background: #D0F0F4;
          color: #5e6c84;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          user-select: none;
          min-width: 20px;
          text-align: center;
        }
        .col-icons {
          display: flex;
          gap: 6px;
        }
        .col-icon {
          cursor: pointer;
          color: #5e6c84;
          font-size: 18px;
          background: none;
          border: none;
          padding: 0;
          user-select: none;
        }
        .col-icon:hover {
          color: #1976d2;
        }
        .create-card {
          background: white;
          padding: 10px;
          border-radius: 6px;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .create-card textarea {
          resize: vertical;
          min-height: 50px;
          font-size: 14px;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #dfe5e5;
          font-family: inherit;
        }
        .create-card textarea:focus {
          outline: none;
          border-color: #1976d2;
        }
        .create-card .create-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .create-card .create-actions select {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid #dfe5e5;
          border-radius: 5px;
          font-size: 14px;
        }
        .create-card button {
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 5px;
          border: 1px solid #dfe5e5;
          background: #f5f6f8;
          user-select: none;
          transition: background-color 0.2s;
        }
        .create-card button:hover {
          background: #e1e7f0;
        }
        .create-link {
          color: #5e6c84;
          cursor: pointer;
          font-size: 13px;
          padding: 8px 0;
          display: block;
          text-align: center;
          user-select: none;
        }
        .create-link:hover {
          color: #1976d2;
          text-decoration: underline;
        }
        .card-item {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
          cursor: pointer;
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid #dfe5e5;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .card-item:hover {
          box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
          border-color: #a2adba;
        }
        .card-item .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: #5e6c84;
          gap: 10px;
        }
        .card-item .card-top .card-id {
          font-family: monospace;
          color: #a2adba;
          user-select: text;
        }
        .card-tag {
          border-radius: 6px;
          padding: 3px 7px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          user-select: none;
        }
        .card-tag-task {
          background: #e1efff;
          color: #1976d2;
        }
        .card-tag-bug {
          background: #ffebec;
          color: #d62127;
        }
        .card-tag-subtask {
          background: #f5e6ff;
          color: #772da0;
        }
        .card-item .card-title {
          font-weight: 600;
          font-size: 14px;
          color: #2b3a59;
        }
        .card-item .card-meta {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: #6b7c93;
          align-items: center;
          user-select: none;
        }
        .card-item .card-meta span {
          background: #f5f7fa;
          color: #6b7c93;
          padding: 3px 8px;
          border-radius: 12px;
        }
        .card-item .card-meta .card-priority.low {
          background: #d4edda;
          color: #155724;
        }
        .card-item .card-meta .card-priority.medium {
          background: #fff3cd;
          color: #856404;
        }
        .card-item .card-meta .card-priority.high {
          background: #f8d7da;
          color: #721c24;
        }
        .assignee-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #222;
          color: white;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 10;
          user-select: none;
        }
        .epic-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .epic-modal {
          background: white;
          border-radius: 8px;
          width: 350px;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          position: relative;
        }
        .epic-modal-content h3 {
          margin: 0 0 20px 0;
          font-weight: 700;
          font-size: 20px;
          color: #2b3a59;
          user-select: none;
        }
        .epic-modal-content p.delete-warning {
          background: #ffe6e6;
          padding: 10px;
          color: #d94343;
          font-size: 14px;
          margin-bottom: 15px;
          border-radius: 6px;
        }
        .epic-modal-input, .epic-modal-select {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          margin-bottom: 20px;
          border-radius: 6px;
          border: 1px solid #dfe5e5;
          box-sizing: border-box;
          font-family: inherit;
        }
        .epic-modal-input:focus, .epic-modal-select:focus {
          outline: none;
          border-color: #485fc7;
        }
        .epic-modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }
        button.create-epic-btn, button.delete-epic-btn {
          background: #485fc7;
          color: white;
          font-weight: 600;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          user-select: none;
        }
        button.create-epic-btn:hover, button.delete-epic-btn:hover {
          background: #374cac;
        }
        button.delete-epic-btn {
          background: #d94343;
        }
        button.delete-epic-btn:hover {
          background: #b83232;
        }
        button.btn-cancel {
          padding: 10px 18px;
          border-radius: 6px;
          border: none;
          background-color: #5e6c84;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        button.btn-cancel:hover {
          background: #485fc7;
        }
        button.btn-create {
          padding: 10px 18px;
          border-radius: 6px;
          border: none;
          background-color: #1976d2;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        button.btn-create:hover {
          background: #1565c0;
        }
        button.btn-delete {
          padding: 10px 18px;
          border-radius: 6px;
          border: none;
          background-color: #d32f2f;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        button.btn-delete:hover {
          background: #c62828;
        }
        button.btn-delete:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

const styles = {
  cancel: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "white",
    color: "#374151",
    cursor: "pointer",
    fontSize: "14px",
  },
  create: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  delete: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
};

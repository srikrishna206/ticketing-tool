



//////////////////////////// for boards //////////////////////////////////////////////////////////


import { v4 as uuidv4 } from 'uuid';

// --- Local Storage Keys ---
const KEY = {
  USER: 'tf_user_v3',
  USERS: 'tf_users_v3',
  PROJECTS: 'tf_projects_v3',
  EPICS: 'tf_epics_v3', // New key for epics
  ISSUES: 'tf_issues_v3',
  ASSETS: 'tf_assets_v3',
  NOTIFS: 'tf_notifs_v3',
};

// --- Detailed Initial User Data ---
const detailedInitialUsers = [
    {
        id: 'u1',
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'Admin',
        department: 'Management',
        active: true,
        language: 'English',
        mobileNumber: '555-1001',
        dateFormat: 'YYYY-MM-DD',
        passwordResetNeeded: false,
        profileFile: null,
    },
    {
        id: 'u2',
        firstName: 'Dev',
        lastName: 'Alice',
        name: 'Dev Alice',
        email: 'alice@demo.com',
        role: 'Developer',
        department: 'Engineering',
        active: true,
        language: 'Spanish',
        mobileNumber: '555-2002',
        dateFormat: 'MM/DD/YYYY',
        passwordResetNeeded: true,
        profileFile: null,
    },
    {
        id: 'u3',
        firstName: 'Manager',
        lastName: 'Bob',
        name: 'Manager Bob',
        email: 'bob@demo.com',
        role: 'Manager',
        department: 'Sales',
        active: false,
        language: 'French',
        mobileNumber: '555-3003',
        dateFormat: 'DD/MM/YYYY',
        passwordResetNeeded: false,
        profileFile: null,
    },
];

// --- Utility Functions for LocalStorage (Enhanced for detailed users) ---

const loadDetailedUsers = () => {
    try {
        const storedData = localStorage.getItem(KEY.USERS);
        if (storedData) {
            const users = JSON.parse(storedData);
            if (users.length > 0 && !users[0].firstName) {
                 console.warn("User data structure outdated. Re-initializing with detailed initial data.");
                 saveDetailedUsers(detailedInitialUsers);
                 return detailedInitialUsers;
            }
            return users;
        }
    } catch (error) {
        console.error("Error reading localStorage:", error);
    }
    saveDetailedUsers(detailedInitialUsers);
    return detailedInitialUsers;
};

const saveDetailedUsers = (users) => {
    try {
        localStorage.setItem(KEY.USERS, JSON.stringify(users));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
};

let users = loadDetailedUsers();

function ensure() {
  if (!localStorage.getItem(KEY.PROJECTS)) {
    const projects = [
      { id: 'mark', key: 'MARK', name: 'Mark Project', description: 'Mark project description', leads: ['u3'] }, // Changed ID
      { id: 'novya', key: 'NOVYA', name: 'Novya Project', description: 'Novya project description', leads: ['u2'] }, // Changed ID
      { id: 'epsilon', key: 'EPSILON', name: 'Epsilon Project', description: 'Epsilon project description', leads: ['u1'] },
    ];
    localStorage.setItem(KEY.PROJECTS, JSON.stringify(projects));
  }

  // New: Initialize Epics
  if (!localStorage.getItem(KEY.EPICS)) {
    const initialEpics = [
      { id: 'e1', projectId: 'mark', name: 'Frontend Epic' },
      { id: 'e2', projectId: 'mark', name: 'Backend Epic' },
      { id: 'e3', projectId: 'novya', name: 'Database Optimization' },
      { id: 'e4', projectId: 'epsilon', name: 'UI/UX Redesign' },
    ];
    localStorage.setItem(KEY.EPICS, JSON.stringify(initialEpics));
  }

  if (!localStorage.getItem(KEY.ISSUES)) {
    const issues = [
      { id: 'i1', projectId: 'mark', epic: 'e1', epicName: 'Frontend Epic', title: 'Setup Mark repo', status: 'todo', priority: 'P2', assignee: 'u2', type: 'Task', storyPoints: 3, createdAt: Date.now() },
      { id: 'i2', projectId: 'mark', epic: 'e1', epicName: 'Frontend Epic', title: 'Login Mark bug', status: 'inprogress', priority: 'P1', assignee: 'u2', type: 'Bug', storyPoints: 1, createdAt: Date.now() },
      { id: 'i3', projectId: 'novya', epic: 'e3', epicName: 'Database Optimization', title: 'OAuth Novya', status: 'done', priority: 'P3', assignee: 'u3', type: 'Story', storyPoints: 5, createdAt: Date.now() },
      { id: 'i4', projectId: 'novya', epic: 'e3', epicName: 'Database Optimization', title: 'Novya Data Migration', status: 'todo', priority: 'P2', assignee: 'u2', type: 'Task', storyPoints: 8, createdAt: Date.now() },
      { id: 'i5', projectId: 'epsilon', epic: 'e4', epicName: 'UI/UX Redesign', title: 'Epsilon Home Page Wireframe', status: 'backlog', priority: 'P3', assignee: 'u1', type: 'Story', storyPoints: 5, createdAt: Date.now() },
    ];
    localStorage.setItem(KEY.ISSUES, JSON.stringify(issues));
  }
  if (!localStorage.getItem(KEY.ASSETS)) {
    localStorage.setItem(KEY.ASSETS, JSON.stringify([{ id: 'a1', name: 'Dev Laptop', type: 'Laptop', owner: 'u2', status: 'active' }]));
  }
  if (!localStorage.getItem(KEY.NOTIFS)) {
    localStorage.setItem(KEY.NOTIFS, JSON.stringify([{ id: uuidv4(), userId: 'u2', text: 'Assigned i1', read: false, ts: Date.now() }]));
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Authentication ---
export async function mockLogin(email) {
  ensure();
  await delay(100);
  const user = users.find(u => u.email === email) || users[0];
  localStorage.setItem(KEY.USER, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY.USER);
  return Promise.resolve();
}

export function getCurrentUser() {
  const s = localStorage.getItem(KEY.USER);
  return s ? JSON.parse(s) : null;
}

// --- Detailed User CRUD ---
export async function listUsers() {
    ensure();
    await delay(100);
    return JSON.parse(JSON.stringify(users));
}

export async function addUser(u) {
    await delay(100);
    users.push(u);
    saveDetailedUsers(users);
    return u;
}

export async function updateUser(updatedUser) {
    await delay(100);
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index === -1) {
        throw new Error('User not found');
    }
    users[index] = { ...users[index], ...updatedUser };
    saveDetailedUsers(users);
    return users[index];
}

export async function deleteUser(userId) {
    await delay(100);
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    if (users.length === initialLength) {
        throw new Error('User not found');
    }
    saveDetailedUsers(users);
    return { success: true, userId };
}

// --- Projects ---
export function listProjects() {
  ensure();
  return Promise.resolve(JSON.parse(localStorage.getItem(KEY.PROJECTS)));
}

export function getProject(id) {
  ensure();
  const projects = JSON.parse(localStorage.getItem(KEY.PROJECTS));
  return Promise.resolve(projects.find(x => x.id === id));
}

export function addProject(p) {
  const arr = JSON.parse(localStorage.getItem(KEY.PROJECTS) || '[]');
  arr.push(p);
  localStorage.setItem(KEY.PROJECTS, JSON.stringify(arr));
  return Promise.resolve(p);
}

export function updateProject(id, updatedProject) {
  const arr = JSON.parse(localStorage.getItem(KEY.PROJECTS) || '[]');
  const idx = arr.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const existingProject = arr[idx];
    arr[idx] = {
      ...existingProject,
      ...updatedProject,
      description: updatedProject.description !== undefined ? updatedProject.description : existingProject.description,
      leads: updatedProject.leads !== undefined ? updatedProject.leads : existingProject.leads
    };
    localStorage.setItem(KEY.PROJECTS, JSON.stringify(arr));
    return Promise.resolve(arr[idx]);
  }
  return Promise.reject(new Error('Project not found'));
}

export function deleteProject(id) {
  const arr = JSON.parse(localStorage.getItem(KEY.PROJECTS) || '[]');
  const filteredProjects = arr.filter(p => p.id !== id);
  localStorage.setItem(KEY.PROJECTS, JSON.stringify(filteredProjects));

  // Also delete epics belonging to this project
  const epicsArr = JSON.parse(localStorage.getItem(KEY.EPICS) || '[]');
  const filteredEpics = epicsArr.filter(e => e.projectId !== id);
  localStorage.setItem(KEY.EPICS, JSON.stringify(filteredEpics));

  // Also delete issues belonging to this project
  const issuesArr = JSON.parse(localStorage.getItem(KEY.ISSUES) || '[]');
  const newIssues = issuesArr.filter(i => i.projectId !== id);
  localStorage.setItem(KEY.ISSUES, JSON.stringify(newIssues));

  return Promise.resolve();
}

// --- Epics (New/Modified) ---
export async function listEpics(projectId = null) {
  ensure();
  await delay(100);
  let epics = JSON.parse(localStorage.getItem(KEY.EPICS) || '[]');
  if (projectId) {
    epics = epics.filter(epic => epic.projectId === projectId);
  }
  return epics;
}

export async function createEpicAPI(projectId, epicName) {
  ensure();
  await delay(100);
  const epics = JSON.parse(localStorage.getItem(KEY.EPICS) || '[]');
  const newEpic = {
    id: 'e' + uuidv4().slice(0, 8), // Generate a unique epic ID
    projectId,
    name: epicName
  };
  epics.push(newEpic);
  localStorage.setItem(KEY.EPICS, JSON.stringify(epics));
  return newEpic;
}

export async function deleteEpicAPI(epicId, projectId) {
  ensure();
  await delay(100);
  let epics = JSON.parse(localStorage.getItem(KEY.EPICS) || '[]');
  const initialLength = epics.length;
  epics = epics.filter(epic => epic.id !== epicId || (projectId && epic.projectId !== projectId));
  if (epics.length === initialLength) {
      throw new Error('Epic not found or does not belong to the specified project.');
  }
  localStorage.setItem(KEY.EPICS, JSON.stringify(epics));

  // Also delete issues within this epic
  let issues = JSON.parse(localStorage.getItem(KEY.ISSUES) || '[]');
  issues = issues.filter(issue => issue.epic !== epicId);
  localStorage.setItem(KEY.ISSUES, JSON.stringify(issues));

  return { success: true, epicId };
}


// --- Issues ---
export function listIssues(projectId = null) { // Modified to accept projectId
  ensure();
  let arr = JSON.parse(localStorage.getItem(KEY.ISSUES));
  if (projectId) arr = arr.filter(i => i.projectId === projectId); // Filter by projectId
  return Promise.resolve(arr);
}

export function getIssue(id) {
  ensure();
  const issues = JSON.parse(localStorage.getItem(KEY.ISSUES));
  return Promise.resolve(issues.find(x => x.id === id));
}

export function createIssue(data) {
  if (!data.projectId || !data.epic) { // Ensure both projectId and epic are present
    return Promise.reject(new Error("Project ID and Epic ID are required to create an issue"));
  }
  const arr = JSON.parse(localStorage.getItem(KEY.ISSUES) || '[]');
  const id = 'i' + Math.floor(Math.random() * 100000);
  const issue = { ...data, id, createdAt: Date.now() };
  arr.push(issue);
  localStorage.setItem(KEY.ISSUES, JSON.stringify(arr));
  return Promise.resolve(issue);
}

export function updateIssue(id, patch) {
  const arr = JSON.parse(localStorage.getItem(KEY.ISSUES) || '[]');
  const idx = arr.findIndex(x => x.id === id);
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], ...patch };
    localStorage.setItem(KEY.ISSUES, JSON.stringify(arr));
    return Promise.resolve(arr[idx]);
  }
  return Promise.reject(new Error('Issue not found'));
}

export function moveIssue(id, status) {
  return updateIssue(id, { status });
}

// --- Assets ---
export function listAssets() {
  ensure();
  return Promise.resolve(JSON.parse(localStorage.getItem(KEY.ASSETS)));
}

export function addAsset(a) {
  const arr = JSON.parse(localStorage.getItem(KEY.ASSETS) || '[]');
  arr.push(a);
  localStorage.setItem(KEY.ASSETS, JSON.stringify(arr));
  return Promise.resolve(a);
}

// --- Notifications ---
export function listNotifs(userId) {
  ensure();
  const arr = JSON.parse(localStorage.getItem(KEY.NOTIFS) || '[]');
  return Promise.resolve(userId ? arr.filter(n => n.userId === userId) : arr);
}

export function markNotif(id) {
  const arr = JSON.parse(localStorage.getItem(KEY.NOTIFS) || '[]');
  const idx = arr.findIndex(n => n.id === id);
  if (idx >= 0) {
    arr[idx].read = true;
    localStorage.setItem(KEY.NOTIFS, JSON.stringify(arr));
  }
  return Promise.resolve();
}

// --- Styles and Utility Functions (Unchanged) ---

const STYLES = {
  container: {
    maxWidth: 'min(90vw, 1200px)',
    margin: '0 0 0 2vw',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: 'clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    marginLeft: '0',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
    marginLeft: '0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginLeft: '0',
    overflowX: 'auto',
  },
  userSection: {
    marginLeft: '0',
    paddingLeft: '0',
    alignSelf: 'flex-start',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  button: {
    padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    opacity: '0.9',
    transform: 'translateY(-2px)',
  },
  avatar: {
    width: 'clamp(2rem, 8vw, 2.5rem)',
    height: 'clamp(2rem, 8vw, 2.5rem)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
    color: 'white',
    fontWeight: '600',
  },
  badge: {
    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
    fontWeight: '500',
  },
  status: {
    todo: { backgroundColor: '#e2e8f0', color: '#4a5568' },
    inprogress: { backgroundColor: '#fefcbf', color: '#744210' },
    done: { backgroundColor: '#c6f6d5', color: '#276749' },
    backlog: { backgroundColor: '#e0f2f7', color: '#01579b' }, // Added backlog status color
    analysis: { backgroundColor: '#fbe9e7', color: '#bf360c' },
    blocked: { backgroundColor: '#ffcdd2', color: '#b71c1c' },
    'code review': { backgroundColor: '#e8eaf6', color: '#3f51b5' },
    qa: { backgroundColor: '#e0f7fa', color: '#006064' },
    milestone: { backgroundColor: '#fce4ec', color: '#ad1457' },
  },
  priority: {
    P1: { backgroundColor: '#fed7d7', color: '#9b2c2c' },
    P2: { backgroundColor: '#fefcbf', color: '#744210' },
    P3: { backgroundColor: '#c6f6d5', color: '#276749' },
  },
  input: {
    padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
    width: '100%',
    boxSizing: 'border-box',
  },
};

const globalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (max-width: 768px) {
  .container { padding: 1rem; margin: 0; }
  .header { padding: 1.2rem; margin-bottom: 1rem; border-radius: 8px; }
  .card { padding: 1rem; margin-bottom: 0.75rem; border-radius: 8px; }
  .table { font-size: 0.9rem; }
  .table th, .table td { padding: 0.5rem; }
  .button { padding: 0.5rem 1rem; font-size: 0.9rem; }
  .avatar { width: 2rem; height: 2rem; font-size: 0.9rem; }
}
@media (max-width: 480px) {
  .container { padding: 0.5rem; }
  .header { padding: 1rem; margin-bottom: 0.75rem; }
  .card { padding: 0.75rem; margin-bottom: 0.5rem; }
  .table { font-size: 0.8rem; }
  .button { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
  .input { padding: 0.5rem; font-size: 0.9rem; }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}


export { STYLES };

export function getUserAvatarStyle(name) {
  return { ...STYLES.avatar, backgroundColor: stringToColor(name) };
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

export function getStatusBadgeStyle(status) {
  return { ...STYLES.badge, ...STYLES.status[status] };
}

export function getPriorityBadgeStyle(priority) {
  return { ...STYLES.badge, ...STYLES.priority[priority] };
}

export function withHover(baseStyle, hoverStyle = STYLES.buttonHover) {
  return {
    ...baseStyle,
    ':hover': hoverStyle
  };
}

export function getCardStyle(variant = 'default') {
  const variants = {
    default: STYLES.card,
    elevated: { ...STYLES.card, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
    bordered: { ...STYLES.card, border: '2px solid #e2e8f0', boxShadow: 'none' }
  };
  return variants[variant] || variants.default;
}

export function getButtonStyle(variant = 'primary') {
  const variants = {
    primary: STYLES.button,
    secondary: {
      ...STYLES.button,
      background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
      color: '#4a5568',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    danger: {
      ...STYLES.button,
      background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
      boxShadow: '0 4px 15px rgba(245, 101, 101, 0.3)'
    }
  };
  return variants[variant] || variants.primary;
}

export function getInputStyle(variant = 'default') {
  const variants = {
    default: STYLES.input,
    search: {
      ...STYLES.input,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\' /%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '12px center',
      backgroundSize: 'clamp(16px, 4vw, 18px)',
      paddingLeft: 'clamp(2rem, 5vw, 2.5rem)',
    }
  };
  return variants[variant] || variants.default;
}

export function getUserSectionStyle() {
  return {
    ...STYLES.userSection,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };
}










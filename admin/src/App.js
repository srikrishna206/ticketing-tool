

import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Updated import for AuthProvider and useAuth
import { ProjectProvider, useProjects } from './context/ProjectContext'; // Assuming ProjectContext exists

// Import your components
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import Users from './components/users/Users';
import ProjectList from './components/projects/ProjectList';
import ProjectView from './components/projects/ProjectView';
import KanbanBoard from './components/boards/KanbanBoard';
import Backlog from './components/backlog/Backlog';
import IssueDetails from './components/issues/IssueDetails';
import IssueCreate from './components/issues/IssueCreate';
import Assets from './components/assets/Assets';
// import Timeline from './components/timeline/Timeline'; // Commented out - Timeline removed from sidebar
import ForYou from './components/dashboard/ForYou';
import Notifications from './components/notifications/Notifications';
import { FiMenu } from 'react-icons/fi';

// PrivateRoute: Only allows authenticated users
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: '#666' }}>
        Loading user...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider> {/* Assuming you have a ProjectProvider */}
        <Routes>
          {/* The root path `/` will now redirect to `/login` by default. */}
          <Route path="/" element={<InitialRootRedirect />} />

          {/* Explicit routes for Login and Registration */}
          <Route path="/login" element={<AuthPageWrapper component={Login} />} /> 
          <Route path="/register" element={<AuthPageWrapper component={Registration} />} />

          {/* All other routes are private, meaning they require authentication */}
          <Route path="/*" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          } />
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}

// Handles initial redirect from root to login
function InitialRootRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  return null;
}

// Wrapper to handle redirection for auth pages (Login/Register)
// If a user is already authenticated, they should not see login/register pages.
function AuthPageWrapper({ component: Component }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect to the main dashboard
      navigate("/for-you", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: '#666' }}>
        Loading authentication...
      </div>
    );
  }

  // Only render the component if the user is NOT authenticated
  return user ? null : <Component />;
}

// Layout component for authenticated users
function Layout() {
  const { user, logout } = useAuth();
  // Ensure useProjects is safely handled if it might return undefined or null initially
  const { projects = [] } = useProjects() || {}; 

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentProjectName, setCurrentProjectName] = useState(null);

  useEffect(() => {
    if (projects && projects.length > 0) {
      // You might want to get the actual current project from context or URL
      setCurrentProjectName(projects[0].name); 
    } else {
      setCurrentProjectName(null);
    }
  }, [projects]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const sidebarStyle = {
    width: sidebarOpen ? '240px' : '70px',
    transition: 'width 0.3s ease',
    backgroundColor: '#459cf9ff',
    color: '#ffffff',
    height: '100vh',
    padding: '16px 12px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000
  };

  const navLinkBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '15px',
    margin: '4px 0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    gap: '12px'
  };

  const navLinkActiveStyle = {
    backgroundColor: '#ffffff',
    color: '#1f2937'
  };

  const contentStyle = {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f9fafb',
    height: '100vh',
    overflowY: 'auto',
    marginLeft: sidebarOpen ? '240px' : '70px',
    transition: 'margin-left 0.3s ease'
  };

  const topbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    margin: '-24px -24px 24px -24px'
  };

  const appShellStyle = {
    display: 'flex',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    fontSize: '14px',
    color: '#111827',
    minHeight: '100vh'
  };

  const menuButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease'
  };

  const userInfoStyle = {
    fontSize: '14px',
    lineHeight: '1.4',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginTop: '12px',
    border: '1px solid #e5e7eb',
    color: '#374151'
  };

  const btnLinkStyle = {
    background: 'none',
    border: 'none',
    color: '#60a5fa',
    cursor: 'pointer',
    padding: '0',
    marginTop: '8px',
    fontSize: '13px',
    textDecoration: 'underline'
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '24px',
    padding: '0 8px'
  };

  const navSectionStyle = {
    marginBottom: '24px'
  };

  // Dynamically set boards path based on currentProjectName
  const boardPath = currentProjectName ? `/kanban/${currentProjectName}` : '/kanban/default';

  const navItems = [
    { path: '/for-you', label: 'For You', icon: '⭐' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: boardPath, label: 'Boards', icon: '📊' }, // Use the dynamic path
    { path: '/assets', label: 'Assets', icon: '🖼️' },
    // { path: '/timeline', label: 'Timeline', icon: '📅' }, // Commented out - Timeline removed from sidebar
    { path: '/users', label: 'Profile', icon: '👥' },
  ];

  return (
    <div style={appShellStyle} role="application" aria-label="Ticketing application">
      <aside style={sidebarStyle} aria-label="Sidebar navigation">
        <div style={navSectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            {sidebarOpen && <div style={logoStyle}>FLOW TRACK</div>}
            <button
              style={menuButtonStyle}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <FiMenu size={20} />
            </button>
          </div>

          <nav role="navigation" aria-label="Main">
            {navItems.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                style={({ isActive }) =>
                  isActive
                    ? { ...navLinkBaseStyle, ...navLinkActiveStyle }
                    : navLinkBaseStyle
                }
                // 'end' prop ensures exact match for parent paths, e.g., /projects vs /projects/123
                // For /kanban/:name, it will match based on the dynamic path
                end={path === '/for-you' || path === '/projects' || path === '/assets' || path === '/timeline' || path === '/users'}
              >
                <span style={{ fontSize: '18px' }}>{icon}</span>
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={navSectionStyle}>
          {user ? (
            <div style={userInfoStyle} aria-label="User Profile">
              {sidebarOpen ? (
                <>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{user.name || 'User'}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>{user.email || 'user@example.com'}</div>
                  <button
                    style={{ ...btnLinkStyle, color: '#4f46e5' }}
                    onClick={logout}
                    onMouseOver={(e) => e.target.style.color = '#6366f1'}
                    onMouseOut={(e) => e.target.style.color = '#4f46e5'}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#374151' }}>👤</div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              style={({ isActive }) =>
                isActive
                  ? { ...navLinkBaseStyle, ...navLinkActiveStyle }
                  : navLinkBaseStyle
              }
            >
              <span style={{ fontSize: '18px' }}>🔐</span>
              {sidebarOpen && <span>Sign in</span>}
            </NavLink>
          )}
        </div>
      </aside>

      <div style={contentStyle}>
        <header style={topbarStyle} role="banner">
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#111827' }}>FLOW TRACK</h1>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Accessible demo • keyboard friendly</div>
        </header>

        <main id="main" tabIndex="-1" role="main" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectView />} />
            <Route path="/kanban/:name" element={<KanbanBoard />} />
            <Route path="/backlog/:id" element={<Backlog />} />
            <Route path="/issues/new" element={<IssueCreate />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/assets" element={<Assets />} />
            {/* <Route path="/timeline" element={<Timeline />} /> */} {/* Commented out - Timeline removed from sidebar */}
            <Route path="/users" element={<Users />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/for-you" element={<ForYou />} />
            <Route path="*" element={<Navigate to="/for-you" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
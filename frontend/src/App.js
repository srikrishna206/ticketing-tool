// for icon responsiveness ok

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ProjectProvider, useProjects } from './context/ProjectContext';

// import Login from './components/auth/Login';
// import Users from './components/users/Users';
// import ProjectList from './components/projects/ProjectList';
// import ProjectView from './components/projects/ProjectView';
// import KanbanBoard from './components/boards/KanbanBoard';
// import Backlog from './components/backlog/Backlog';
// import IssueDetails from './components/issues/IssueDetails';
// import IssueCreate from './components/issues/IssueCreate';
// import Assets from './components/assets/Assets';
// import Timeline from './components/timeline/Timeline';
// import ForYou from './components/dashboard/ForYou';
// import Notifications from './components/notifications/Notifications';
// import { FiMenu, FiLogOut, FiUser, FiX, FiHome, FiList, FiGrid, FiBriefcase, FiClock } from 'react-icons/fi';

// // PrivateRoute: Only allows authenticated users
// function PrivateRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" replace />;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ProjectProvider>
//         <Routes>
//           <Route path="/" element={<AuthLanding />} />
//           <Route path="/login" element={<LoginRedirectAfterAuth />} />
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <Layout />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </ProjectProvider>
//     </AuthProvider>
//   );
// }

// function AuthLanding() {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   } else {
//     return <Navigate to="/for-you" replace />;
//   }
// }

// function LoginRedirectAfterAuth() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/for-you', { replace: true });
//     }
//   }, [user, navigate]);

//   return <Login />;
// }

// function Layout() {
//   const { user, logout } = useAuth();
//   const { projects } = useProjects();
//   const location = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [currentProjectName, setCurrentProjectName] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setMobileSidebarOpen(false);
//       }
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   useEffect(() => {
//     if (isMobile) {
//       setMobileSidebarOpen(false);
//     }
//   }, [location.pathname, isMobile]);

//   useEffect(() => {
//     if (projects.length > 0) {
//       setCurrentProjectName(projects[0].name);
//     } else {
//       setCurrentProjectName(null);
//     }
//   }, [projects]);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setMobileSidebarOpen((prev) => !prev);
//     } else {
//       setSidebarOpen((prev) => !prev);
//     }
//   };

//   const closeMobileSidebar = () => {
//     setMobileSidebarOpen(false);
//   };

//   const navItems = [
//     { path: '/for-you', label: 'For You', icon: <FiHome /> },
//     {
//       path: currentProjectName ? `/kanban/${currentProjectName}` : '/boards',
//       label: 'Boards',
//       icon: <FiGrid />,
//     },
//     { path: '/assets', label: 'Assets', icon: <FiList /> },
//     { path: '/timeline', label: 'Timeline', icon: <FiClock /> },
//   ];

//   const getPageTitle = () => {
//     const path = location.pathname;
//     if (path === '/for-you') return 'DASHBOARD';
//     if (path.includes('/kanban')) return 'PROJECT BOARDS';
//     if (path === '/assets') return 'ASSETS';
//     if (path === '/timeline') return 'TIMELINE';
//     return 'Flow Track';
//   };

//   // Responsive icon sizing helper
//   const getIconSize = () => {
//     // More prominent when sidebar open, bigger on mobile, compact when sidebar collapsed
//     if (isMobile) {
//       return mobileSidebarOpen ? 28 : 26;
//     }
//     if (sidebarOpen) {
//       return 26;
//     }
//     return 22;
//   };

//   const styles = {
//     appShell: {
//       display: 'flex',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       minHeight: '100vh',
//       background: '#19a0f7',
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     sidebar: {
//       width: isMobile ? (mobileSidebarOpen ? '270px' : '60px') : sidebarOpen ? '270px' : '60px',
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       background: '#19a0f7',
//       color: '#222',
//       height: '100vh',
//       padding: isMobile ? (mobileSidebarOpen ? '24px 16px' : '0') : sidebarOpen ? '24px 16px' : '0',
//       boxSizing: 'border-box',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//       position: isMobile ? 'fixed' : 'relative',
//       left: 0,
//       top: 0,
//       zIndex: 30,
//       boxShadow: '0 0 40px rgba(0,0,0,0.1)',
//       overflow: isMobile ? (mobileSidebarOpen ? 'auto' : 'hidden') : 'hidden',
//       alignItems: sidebarOpen || mobileSidebarOpen ? 'stretch' : 'center',
//     },
//     logo: {
//       display: 'flex',
//       alignItems: 'center',
//       marginBottom: isMobile ? '24px' : '32px',
//       justifyContent: sidebarOpen || mobileSidebarOpen ? 'flex-start' : 'center',
//     },
//     logoText: {
//       fontSize: isMobile ? '22px' : '26px',
//       fontWeight: '700',
//       color: '#fff',
//       margin: '0 14px',
//       letterSpacing: '.5px',
//       display: sidebarOpen || mobileSidebarOpen ? 'inline' : 'none',
//     },
//     menuButton: {
//       background: 'rgba(255,255,255,0.90)',
//       border: 'none',
//       color: '#19a0f7',
//       cursor: 'pointer',
//       padding: '12px',
//       borderRadius: '12px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: '18px 0',
//       width: '36px',
//       height: '36px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//       flexShrink: 0,
//     },
//     navItemsContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       flexGrow: 1,
//       justifyContent: 'center',
//       marginTop: isMobile ? 0 : 0,
//     },
//     navLink: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: sidebarOpen || mobileSidebarOpen ? 'center' : 'center',
//       width: '100%',
//       padding: '12px 0',
//       margin: '10px 0',
//       background: '#fff',
//       border: 'none',
//       borderRadius: '14px',
//       color: '#276ef1',
//       fontWeight: '500',
//       fontSize: isMobile ? '18px' : '17px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
//       textAlign: 'center',
//       textDecoration: 'none',
//       transition: 'background 0.2s, color 0.2s',
//       outline: 'none',
//       gap: sidebarOpen || mobileSidebarOpen ? '15px' : '0',
//       flexShrink: 0,
//     },
//     navLinkActive: {
//       background: '#e8efff',
//       color: '#156fe6',
//       boxShadow: '0 2px 14px rgba(29,160,247,0.15)',
//     },
//     navLinkHover: {
//       background: '#e6f4ff',
//       color: '#19a0f7',
//     },
//     userInfo: {
//       padding: isMobile ? '16px' : '20px',
//       background: '#fff',
//       borderRadius: '17px',
//       color: '#19a0f7',
//       border: 'none',
//       marginTop: '20px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
//       textAlign: 'left',
//       display: sidebarOpen || mobileSidebarOpen ? 'block' : 'none',
//       flexShrink: 0,
//     },
//     btnLink: {
//       background: '#19a0f7',
//       color: '#fff',
//       cursor: 'pointer',
//       padding: isMobile ? '10px 16px' : '8px 16px',
//       borderRadius: '10px',
//       fontSize: isMobile ? '15px' : '14px',
//       fontWeight: '600',
//       marginTop: '14px',
//       border: 'none',
//       width: '100%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '7px',
//       boxShadow: '0 1px 6px rgba(29,160,247,0.08)',
//     },
//     btnLinkHover: {
//       background: '#117cd4',
//     },
//     userIconOnly: {
//       display: !sidebarOpen && !mobileSidebarOpen ? 'flex' : 'none',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontSize: isMobile ? '28px' : '26px',
//       background: '#fff',
//       borderRadius: '16px',
//       marginTop: '20px',
//       color: '#19a0f7',
//       width: '20px',
//       height: '20px',
//       flexShrink: 0,
//     },
//     closeSidebarButton: {
//       position: 'absolute',
//       top: '16px',
//       right: '16px',
//       background: 'rgba(255,255,255,0.90)',
//       color: '#19a0f7',
//       border: 'none',
//       borderRadius: '8px',
//       width: '32px',
//       height: '32px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       cursor: 'pointer',
//       zIndex: 35,
//     },
//     content: {
//       flex: 1,
//       padding: '0',
//       height: '100vh',
//       overflowY: 'auto',
//       position: 'relative',
//       zIndex: 10,
//       marginLeft: isMobile ? '0' : sidebarOpen ? '0' : '0',
//       width: isMobile ? '100%' : 'auto',
//       background: '#19a0f7',
//     },
//     topbar: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       background: '#19a0f7',
//       padding: isMobile ? '16px 20px' : '24px 36px',
//       borderBottom: 'none',
//       boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
//       position: 'relative',
//       zIndex: 15,
//       flexWrap: isMobile ? 'wrap' : 'nowrap',
//       gap: isMobile ? '12px' : '0',
//     },
//     pageTitle: {
//       fontSize: isMobile ? '20px' : '28px',
//       fontWeight: '700',
//       color: '#fff',
//       margin: '0',
//       letterSpacing: '.7px',
//     },
//     mobileSidebarOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.30)',
//       zIndex: 25,
//       display: mobileSidebarOpen ? 'block' : 'none',
//     },
//   };

//   const showFullUserInfo = isMobile ? mobileSidebarOpen : sidebarOpen;

//   return (
//     <div style={styles.appShell} role="application" aria-label="Flow Track application">
//       {/* Mobile Sidebar Overlay */}
//       {isMobile && <div style={styles.mobileSidebarOverlay} onClick={closeMobileSidebar} aria-hidden="true" />}

//       {/* Sidebar */}
//       <aside style={styles.sidebar} aria-label="Sidebar navigation">
//         {/* Always show menu button */}
//         <div style={styles.logo}>
//           <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle sidebar">
//             <FiMenu size={26} />
//           </button>
//           <span style={styles.logoText}>FLOW TRACK</span>
//         </div>

//         {/* Navigation items */}
//         <div style={styles.navItemsContainer}>
//           <nav role="navigation" aria-label="Main navigation">
//             {navItems.map(({ path, label, icon }) => (
//               <NavLink
//                 key={path}
//                 to={path}
//                 style={({ isActive }) => ({
//                   ...styles.navLink,
//                   ...(isActive ? styles.navLinkActive : {}),
//                 })}
//                 end
//                 onClick={isMobile ? closeMobileSidebar : undefined}
//                 aria-label={label}
//                 title={!sidebarOpen && !mobileSidebarOpen ? label : undefined}
//               >
//                 <span
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     fontSize: getIconSize(),
//                     transition: 'font-size 0.2s',
//                     minWidth: getIconSize() + 6,
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {
//                     // clone element as needed for prop passing, otherwise just use icon with size prop
//                     React.cloneElement(icon, { size: getIconSize() })
//                   }
//                 </span>
//                 {(sidebarOpen || mobileSidebarOpen) && <span>{label}</span>}
//               </NavLink>
//             ))}
//           </nav>
//         </div>

//         {/* User info or icon */}
//         {user ? (
//           showFullUserInfo ? (
//             <div style={styles.userInfo} aria-label="User Profile">
//               <div style={{ fontWeight: '600', fontSize: isMobile ? '15px' : '16px', color: '#19a0f7' }}>{user.name}</div>
//               <div style={{ color: '#222', fontSize: isMobile ? '13px' : '14px', marginTop: '4px' }}>{user.email}</div>
//               <button style={styles.btnLink} onClick={logout}>
//                 <FiLogOut /> {(isMobile && mobileSidebarOpen) || (!isMobile && sidebarOpen) ? 'Sign Out' : ''}
//               </button>
//             </div>
//           ) : (
//             <div style={styles.userIconOnly}>
//               <FiUser style={{ fontSize: styles.userIconOnly.fontSize, color: '#19a0f7' }} />
//             </div>
//           )
//         ) : (
//           <NavLink to="/login" style={styles.navLink}>
//             Sign in
//           </NavLink>
//         )}

//         {/* Close button for mobile */}
//         {isMobile && mobileSidebarOpen && (
//           <button style={styles.closeSidebarButton} onClick={closeMobileSidebar} aria-label="Close sidebar">
//             <FiX size={18} />
//           </button>
//         )}
//       </aside>

//       <div style={styles.content}>
//         <header style={styles.topbar} role="banner">
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {isMobile && (
//               <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Open menu">
//                 <FiMenu size={18} />
//               </button>
//             )}
//             <h1 style={styles.pageTitle}>{getPageTitle()}</h1>
//           </div>
//         </header>
//         <main
//           id="main"
//           tabIndex="-1"
//           role="main"
//           style={{
//             padding: isMobile ? '20px 16px' : '32px',
//             minHeight: 'calc(100vh - 80px)',
//             maxWidth: '100%',
//             overflowX: 'hidden',
//             background: '#19a0f7',
//           }}
//         >
//           <Routes>
//             <Route path="/kanban/:name" element={<KanbanBoard />} />
//             <Route path="/backlog/:id" element={<Backlog />} />
//             <Route path="/issues/new" element={<IssueCreate />} />
//             <Route path="/issues/:id" element={<IssueDetails />} />
//             <Route path="/assets" element={<Assets />} />
//             <Route path="/timeline" element={<Timeline />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/notifications" element={<Notifications />} />
//             <Route path="/for-you" element={<ForYou />} />
//             <Route path="*" element={<Navigate to="/for-you" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// for user icon size ok .

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ProjectProvider, useProjects } from './context/ProjectContext';

// import Login from './components/auth/Login';
// import Users from './components/users/Users';
// import ProjectList from './components/projects/ProjectList';
// import ProjectView from './components/projects/ProjectView';
// import KanbanBoard from './components/boards/KanbanBoard';
// import Backlog from './components/backlog/Backlog';
// import IssueDetails from './components/issues/IssueDetails';
// import IssueCreate from './components/issues/IssueCreate';
// import Assets from './components/assets/Assets';
// import Timeline from './components/timeline/Timeline';
// import ForYou from './components/dashboard/ForYou';
// import Notifications from './components/notifications/Notifications';
// import { FiMenu, FiLogOut, FiUser, FiX, FiHome, FiList, FiGrid, FiBriefcase, FiClock } from 'react-icons/fi';

// // PrivateRoute: Only allows authenticated users
// function PrivateRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" replace />;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ProjectProvider>
//         <Routes>
//           <Route path="/" element={<AuthLanding />} />
//           <Route path="/login" element={<LoginRedirectAfterAuth />} />
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <Layout />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </ProjectProvider>
//     </AuthProvider>
//   );
// }

// function AuthLanding() {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   } else {
//     return <Navigate to="/for-you" replace />;
//   }
// }

// function LoginRedirectAfterAuth() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/for-you', { replace: true });
//     }
//   }, [user, navigate]);

//   return <Login />;
// }

// function Layout() {
//   const { user, logout } = useAuth();
//   const { projects } = useProjects();
//   const location = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [currentProjectName, setCurrentProjectName] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setMobileSidebarOpen(false);
//       }
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   useEffect(() => {
//     if (isMobile) {
//       setMobileSidebarOpen(false);
//     }
//   }, [location.pathname, isMobile]);

//   useEffect(() => {
//     if (projects.length > 0) {
//       setCurrentProjectName(projects[0].name);
//     } else {
//       setCurrentProjectName(null);
//     }
//   }, [projects]);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setMobileSidebarOpen((prev) => !prev);
//     } else {
//       setSidebarOpen((prev) => !prev);
//     }
//   };

//   const closeMobileSidebar = () => {
//     setMobileSidebarOpen(false);
//   };

//   const navItems = [
//     { path: '/for-you', label: 'For You', icon: <FiHome /> },
//     {
//       path: currentProjectName ? `/kanban/${currentProjectName}` : '/boards',
//       label: 'Boards',
//       icon: <FiGrid />,
//     },
//     { path: '/assets', label: 'Assets', icon: <FiList /> },
//     { path: '/timeline', label: 'Timeline', icon: <FiClock /> },
//   ];

//   const getPageTitle = () => {
//     const path = location.pathname;
//     if (path === '/for-you') return 'DASHBOARD';
//     if (path.includes('/kanban')) return 'PROJECT BOARDS';
//     if (path === '/assets') return 'ASSETS';
//     if (path === '/timeline') return 'TIMELINE';
//     return 'Flow Track';
//   };

//   // Responsive icon sizing helper
//   const getIconSize = () => {
//     // More prominent when sidebar open, bigger on mobile, compact when sidebar collapsed
//     if (isMobile) {
//       return mobileSidebarOpen ? 28 : 26;
//     }
//     if (sidebarOpen) {
//       return 26;
//     }
//     return 22;
//   };

//   const styles = {
//     appShell: {
//       display: 'flex',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       minHeight: '100vh',
//       background: '#19a0f7',
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     sidebar: {
//       width: isMobile ? (mobileSidebarOpen ? '270px' : '60px') : sidebarOpen ? '270px' : '60px',
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       background: '#19a0f7',
//       color: '#222',
//       height: '100vh',
//       padding: isMobile ? (mobileSidebarOpen ? '24px 16px' : '0') : sidebarOpen ? '24px 16px' : '0',
//       boxSizing: 'border-box',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//       position: isMobile ? 'fixed' : 'relative',
//       left: 0,
//       top: 0,
//       zIndex: 30,
//       boxShadow: '0 0 40px rgba(0,0,0,0.1)',
//       overflow: isMobile ? (mobileSidebarOpen ? 'auto' : 'hidden') : 'hidden',
//       alignItems: sidebarOpen || mobileSidebarOpen ? 'stretch' : 'center',
//     },
//     logo: {
//       display: 'flex',
//       alignItems: 'center',
//       marginBottom: isMobile ? '24px' : '32px',
//       justifyContent: sidebarOpen || mobileSidebarOpen ? 'flex-start' : 'center',
//     },
//     logoText: {
//       fontSize: isMobile ? '22px' : '26px',
//       fontWeight: '700',
//       color: '#fff',
//       margin: '0 14px',
//       letterSpacing: '.5px',
//       display: sidebarOpen || mobileSidebarOpen ? 'inline' : 'none',
//     },
//     menuButton: {
//       background: 'rgba(255,255,255,0.90)',
//       border: 'none',
//       color: '#19a0f7',
//       cursor: 'pointer',
//       padding: '12px',
//       borderRadius: '12px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: '18px 0',
//       width: '36px',
//       height: '36px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//       flexShrink: 0,
//     },
//     navItemsContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       flexGrow: 1,
//       justifyContent: 'center',
//       marginTop: isMobile ? 0 : 0,
//     },
//     navLink: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: sidebarOpen || mobileSidebarOpen ? 'center' : 'center',
//       width: '100%',
//       padding: '12px 0',
//       margin: '10px 0',
//       background: '#fff',
//       border: 'none',
//       borderRadius: '14px',
//       color: '#276ef1',
//       fontWeight: '500',
//       fontSize: isMobile ? '18px' : '17px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
//       textAlign: 'center',
//       textDecoration: 'none',
//       transition: 'background 0.2s, color 0.2s',
//       outline: 'none',
//       gap: sidebarOpen || mobileSidebarOpen ? '15px' : '0',
//       flexShrink: 0,
//     },
//     navLinkActive: {
//       background: '#e8efff',
//       color: '#156fe6',
//       boxShadow: '0 2px 14px rgba(29,160,247,0.15)',
//     },
//     navLinkHover: {
//       background: '#e6f4ff',
//       color: '#19a0f7',
//     },
//     userInfo: {
//       padding: isMobile ? '16px' : '20px',
//       background: '#fff',
//       borderRadius: '17px',
//       color: '#19a0f7',
//       border: 'none',
//       marginTop: '20px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
//       textAlign: 'left',
//       display: sidebarOpen || mobileSidebarOpen ? 'block' : 'none',
//       flexShrink: 0,
//     },
//     btnLink: {
//       background: '#19a0f7',
//       color: '#fff',
//       cursor: 'pointer',
//       padding: isMobile ? '10px 16px' : '8px 16px',
//       borderRadius: '10px',
//       fontSize: isMobile ? '15px' : '14px',
//       fontWeight: '600',
//       marginTop: '14px',
//       border: 'none',
//       width: '100%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '7px',
//       boxShadow: '0 1px 6px rgba(29,160,247,0.08)',
//     },
//     btnLinkHover: {
//       background: '#117cd4',
//     },
//     userIconOnly: {
//       display: !sidebarOpen && !mobileSidebarOpen ? 'flex' : 'none',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontSize: isMobile ? '38px' : '38px', // CHANGED: larger icon size for compact sidebar
//       background: '#fff',
//       borderRadius: '16px',
//       marginTop: '20px',
//       color: '#19a0f7',
//       width: '48px',
//       height: '48px',
//       flexShrink: 0,
//     },
//     closeSidebarButton: {
//       position: 'absolute',
//       top: '16px',
//       right: '16px',
//       background: 'rgba(255,255,255,0.90)',
//       color: '#19a0f7',
//       border: 'none',
//       borderRadius: '8px',
//       width: '32px',
//       height: '32px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       cursor: 'pointer',
//       zIndex: 35,
//     },
//     content: {
//       flex: 1,
//       padding: '0',
//       height: '100vh',
//       overflowY: 'auto',
//       position: 'relative',
//       zIndex: 10,
//       marginLeft: isMobile ? '0' : sidebarOpen ? '0' : '0',
//       width: isMobile ? '100%' : 'auto',
//       background: '#19a0f7',
//     },
//     topbar: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       background: '#19a0f7',
//       padding: isMobile ? '16px 20px' : '24px 36px',
//       borderBottom: 'none',
//       boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
//       position: 'relative',
//       zIndex: 15,
//       flexWrap: isMobile ? 'wrap' : 'nowrap',
//       gap: isMobile ? '12px' : '0',
//     },
//     pageTitle: {
//       fontSize: isMobile ? '20px' : '28px',
//       fontWeight: '700',
//       color: '#fff',
//       margin: '0',
//       letterSpacing: '.7px',
//     },
//     mobileSidebarOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.30)',
//       zIndex: 25,
//       display: mobileSidebarOpen ? 'block' : 'none',
//     },
//   };

//   const showFullUserInfo = isMobile ? mobileSidebarOpen : sidebarOpen;

//   return (
//     <div style={styles.appShell} role="application" aria-label="Flow Track application">
//       {/* Mobile Sidebar Overlay */}
//       {isMobile && <div style={styles.mobileSidebarOverlay} onClick={closeMobileSidebar} aria-hidden="true" />}

//       {/* Sidebar */}
//       <aside style={styles.sidebar} aria-label="Sidebar navigation">
//         {/* Always show menu button */}
//         <div style={styles.logo}>
//           <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle sidebar">
//             <FiMenu size={26} />
//           </button>
//           <span style={styles.logoText}>FLOW TRACK</span>
//         </div>

//         {/* Navigation items */}
//         <div style={styles.navItemsContainer}>
//           <nav role="navigation" aria-label="Main navigation">
//             {navItems.map(({ path, label, icon }) => (
//               <NavLink
//                 key={path}
//                 to={path}
//                 style={({ isActive }) => ({
//                   ...styles.navLink,
//                   ...(isActive ? styles.navLinkActive : {}),
//                 })}
//                 end
//                 onClick={isMobile ? closeMobileSidebar : undefined}
//                 aria-label={label}
//                 title={!sidebarOpen && !mobileSidebarOpen ? label : undefined}
//               >
//                 <span
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     fontSize: getIconSize(),
//                     transition: 'font-size 0.2s',
//                     minWidth: getIconSize() + 6,
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {React.cloneElement(icon, { size: getIconSize() })}
//                 </span>
//                 {(sidebarOpen || mobileSidebarOpen) && <span>{label}</span>}
//               </NavLink>
//             ))}
//           </nav>
//         </div>

//         {/* User info or icon */}
//         {user ? (
//           showFullUserInfo ? (
//             <div style={styles.userInfo} aria-label="User Profile">
//               <div style={{ fontWeight: '600', fontSize: isMobile ? '15px' : '16px', color: '#19a0f7' }}>{user.name}</div>
//               <div style={{ color: '#222', fontSize: isMobile ? '13px' : '14px', marginTop: '4px' }}>{user.email}</div>
//               <button style={styles.btnLink} onClick={logout}>
//                 <FiLogOut /> {(isMobile && mobileSidebarOpen) || (!isMobile && sidebarOpen) ? 'Sign Out' : ''}
//               </button>
//             </div>
//           ) : (
//             <div style={styles.userIconOnly}>
//               <FiUser size={38} style={{ color: '#19a0f7' }} /> {/* CHANGED: user icon larger when sidebar collapsed */}
//             </div>
//           )
//         ) : (
//           <NavLink to="/login" style={styles.navLink}>
//             Sign in
//           </NavLink>
//         )}

//         {/* Close button for mobile */}
//         {isMobile && mobileSidebarOpen && (
//           <button style={styles.closeSidebarButton} onClick={closeMobileSidebar} aria-label="Close sidebar">
//             <FiX size={18} />
//           </button>
//         )}
//       </aside>

//       <div style={styles.content}>
//         <header style={styles.topbar} role="banner">
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {isMobile && (
//               <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Open menu">
//                 <FiMenu size={18} />
//               </button>
//             )}
//             <h1 style={styles.pageTitle}>{getPageTitle()}</h1>
//           </div>
//         </header>
//         <main
//           id="main"
//           tabIndex="-1"
//           role="main"
//           style={{
//             padding: isMobile ? '20px 16px' : '32px',
//             minHeight: 'calc(100vh - 80px)',
//             maxWidth: '100%',
//             overflowX: 'hidden',
//             background: '#19a0f7',
//           }}
//         >
//           <Routes>
//             <Route path="/kanban/:name" element={<KanbanBoard />} />
//             <Route path="/backlog/:id" element={<Backlog />} />
//             <Route path="/issues/new" element={<IssueCreate />} />
//             <Route path="/issues/:id" element={<IssueDetails />} />
//             <Route path="/assets" element={<Assets />} />
//             <Route path="/timeline" element={<Timeline />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/notifications" element={<Notifications />} />
//             <Route path="/for-you" element={<ForYou />} />
//             <Route path="*" element={<Navigate to="/for-you" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// for remove the margin b/w the sidebar and browser edge ok .

import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProjects } from './context/ProjectContext';

import Login from './components/auth/Login';
import Users from './components/users/Users';

import KanbanBoard from './components/boards/KanbanBoard';
import Backlog from './components/backlog/Backlog';
import IssueDetails from './components/issues/IssueDetails';
import IssueCreate from './components/issues/IssueCreate';
import Assets from './components/assets/Assets';
// import Timeline from './components/timeline/Timeline'; // Commented out - Timeline removed from sidebar
import ForYou from './components/dashboard/ForYou';
import Notifications from './components/notifications/Notifications';
import { FiMenu, FiLogOut, FiUser, FiX, FiHome, FiList, FiGrid, FiBriefcase /*, FiClock */ } from 'react-icons/fi';

// PrivateRoute: Only allows authenticated users
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/login" element={<LoginRedirectAfterAuth />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          />
        </Routes>
      </ProjectProvider>
    </AuthProvider>
  );
}

function AuthLanding() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  } else {
    return <Navigate to="/for-you" replace />;
  }
}

function LoginRedirectAfterAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/for-you', { replace: true });
    }
  }, [user, navigate]);

  return <Login />;
}

function Layout() {
  const { user, logout, refreshUserData } = useAuth();
  const { projects } = useProjects();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Refresh user data on mount to get latest changes from admin
  useEffect(() => {
    if (user && refreshUserData) {
      refreshUserData().catch(err => {
        console.log('Could not refresh user data:', err);
      });
    }
  }, []); // Only run once on mount

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
  const isBoard = location.pathname.startsWith('/kanban');
  const prevPadding = document.body.style.padding;
  const prevBackground = document.body.style.backgroundColor;
  document.body.style.padding = isBoard ? '0' : '0';
  document.body.style.backgroundColor = isBoard ? '#19a0f7' : '#D0F0F4';
  return () => {
    document.body.style.padding = prevPadding;
    document.body.style.backgroundColor = prevBackground;
  };
}, [location.pathname]);

  useEffect(() => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    if (projects.length > 0) {
      setCurrentProjectName(projects[0].name);
    } else {
      setCurrentProjectName(null);
    }
  }, [projects]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const navItems = [
    { path: '/for-you', label: 'For You', icon: <FiHome /> },
    {
      path: currentProjectName ? `/kanban/${currentProjectName}` : '/boards',
      label: 'Boards',
      icon: <FiGrid />,
    },
    { path: '/assets', label: 'Assets', icon: <FiList /> },
    // { path: '/timeline', label: 'Timeline', icon: <FiClock /> }, // Commented out - Timeline removed from sidebar
    { path: '/users', label: 'Profile', icon: <FiUser /> },

  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/for-you') return 'DASHBOARD';
    if (path.includes('/kanban')) return 'PROJECT BOARDS';
    if (path === '/assets') return 'ASSETS';
    if (path === '/timeline') return 'TIMELINE';
    if (path === '/users') return 'USERS';

    return 'Flow Track';
  };

  // Responsive icon sizing helper
  const getIconSize = () => {
    // More prominent when sidebar open, bigger on mobile, compact when sidebar collapsed
    if (isMobile) {
      return mobileSidebarOpen ? 28 : 26;
    }
    if (sidebarOpen) {
      return 26;
    }
    return 22;
  };

  const styles = {
    appShell: {
      display: 'flex',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      background: '#19a0f7',
      position: 'relative',
      overflow: 'hidden',
    },
    sidebar: {
      width: isMobile ? (mobileSidebarOpen ? '270px' : '60px') : sidebarOpen ? '270px' : '60px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: '#19a0f7',
      color: '#222',
      height: '100vh',
      padding: isMobile ? (mobileSidebarOpen ? '24px 16px' : '0') : sidebarOpen ? '24px 16px' : '0',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: isMobile ? 'fixed' : 'relative',
      left: 0,
      top: 0,
      zIndex: 30,
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
      overflow: isMobile ? (mobileSidebarOpen ? 'auto' : 'hidden') : 'hidden',
      alignItems: sidebarOpen || mobileSidebarOpen ? 'stretch' : 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: isMobile ? '24px' : '32px',
      justifyContent: sidebarOpen || mobileSidebarOpen ? 'flex-start' : 'center',
    },
    logoText: {
      fontSize: isMobile ? '22px' : '26px',
      fontWeight: '700',
      color: '#fff',
      margin: '0 14px',
      letterSpacing: '.5px',
      display: sidebarOpen || mobileSidebarOpen ? 'inline' : 'none',
    },
    menuButton: {
      background: 'rgba(255,255,255,0.90)',
      border: 'none',
      color: '#19a0f7',
      cursor: 'pointer',
      padding: '12px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '18px 0',
      width: '36px',
      height: '36px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      flexShrink: 0,
    },
    navItemsContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'center',
      marginTop: isMobile ? 0 : 0,
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebarOpen || mobileSidebarOpen ? 'center' : 'center',
      width: '100%',
      padding: '12px 0',
      margin: '10px 0',
      background: '#fff',
      border: 'none',
      borderRadius: '14px',
      color: '#276ef1',
      fontWeight: '500',
      fontSize: isMobile ? '18px' : '17px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
      textAlign: 'center',
      textDecoration: 'none',
      transition: 'background 0.2s, color 0.2s',
      outline: 'none',
      gap: sidebarOpen || mobileSidebarOpen ? '15px' : '0',
      flexShrink: 0,
    },
    navLinkActive: {
      background: '#e8efff',
      color: '#156fe6',
      boxShadow: '0 2px 14px rgba(29,160,247,0.15)',
    },
    navLinkHover: {
      background: '#e6f4ff',
      color: '#19a0f7',
    },
    userInfo: {
      padding: isMobile ? '16px' : '20px',
      background: '#fff',
      borderRadius: '17px',
      color: '#19a0f7',
      border: 'none',
      marginTop: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      textAlign: 'left',
      display: sidebarOpen || mobileSidebarOpen ? 'block' : 'none',
      flexShrink: 0,
    },
    btnLink: {
      background: '#19a0f7',
      color: '#fff',
      cursor: 'pointer',
      padding: isMobile ? '10px 16px' : '8px 16px',
      borderRadius: '10px',
      fontSize: isMobile ? '15px' : '14px',
      fontWeight: '600',
      marginTop: '14px',
      border: 'none',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      boxShadow: '0 1px 6px rgba(29,160,247,0.08)',
    },
    btnLinkHover: {
      background: '#117cd4',
    },
    userIconOnly: {
      display: !sidebarOpen && !mobileSidebarOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '38px' : '38px', // CHANGED: larger icon size for compact sidebar
      background: '#fff',
      borderRadius: '16px',
      marginTop: '20px',
      color: '#19a0f7',
      width: '48px',
      height: '48px',
      flexShrink: 0,
    },
    closeSidebarButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'rgba(255,255,255,0.90)',
      color: '#19a0f7',
      border: 'none',
      borderRadius: '8px',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 35,
    },
    content: {
      flex: 1,
      padding: '0',
      height: '100vh',
      overflowY: 'auto',
      position: 'relative',
      zIndex: 10,
      marginLeft: isMobile ? '0' : sidebarOpen ? '0' : '0',
      width: isMobile ? '100%' : 'auto',
      background: '#19a0f7',
    },
    topbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#19a0f7',
      padding: isMobile ? '16px 20px' : '24px 36px',
      borderBottom: 'none',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      position: 'relative',
      zIndex: 15,
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      gap: isMobile ? '12px' : '0',
    },
    pageTitle: {
      fontSize: isMobile ? '20px' : '28px',
      fontWeight: '700',
      color: '#fff',
      margin: '0',
      letterSpacing: '.7px',
    },
    mobileSidebarOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.30)',
      zIndex: 25,
      display: mobileSidebarOpen ? 'block' : 'none',
    },
  };

  const showFullUserInfo = isMobile ? mobileSidebarOpen : sidebarOpen;

  return (
    <div style={styles.appShell} role="application" aria-label="Flow Track application">
      {/* Mobile Sidebar Overlay */}
      {isMobile && <div style={styles.mobileSidebarOverlay} onClick={closeMobileSidebar} aria-hidden="true" />}

      {/* Sidebar */}
      <aside style={styles.sidebar} aria-label="Sidebar navigation">
        {/* Always show menu button */}
        <div style={styles.logo}>
          <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle sidebar">
            <FiMenu size={26} />
          </button>
          <span style={styles.logoText}>FLOW TRACK</span>
        </div>

        {/* Navigation items */}
        <div style={styles.navItemsContainer}>
          <nav role="navigation" aria-label="Main navigation">
            {navItems.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
                end
                onClick={isMobile ? closeMobileSidebar : undefined}
                aria-label={label}
                title={!sidebarOpen && !mobileSidebarOpen ? label : undefined}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: getIconSize(),
                    transition: 'font-size 0.2s',
                    minWidth: getIconSize() + 6,
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(icon, { size: getIconSize() })}
                </span>
                {(sidebarOpen || mobileSidebarOpen) && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User info or icon */}
        {user ? (
          showFullUserInfo ? (
            <div style={styles.userInfo} aria-label="User Profile">
              <div style={{ fontWeight: '600', fontSize: isMobile ? '15px' : '16px', color: '#19a0f7' }}>{user.name}</div>
              <div style={{ color: '#222', fontSize: isMobile ? '13px' : '14px', marginTop: '4px' }}>{user.email}</div>
              <button style={styles.btnLink} onClick={logout}>
                <FiLogOut /> {(isMobile && mobileSidebarOpen) || (!isMobile && sidebarOpen) ? 'Sign Out' : ''}
              </button>
            </div>
          ) : (
            <div style={styles.userIconOnly}>
              <FiUser size={38} style={{ color: '#19a0f7' }} /> {/* CHANGED: user icon larger when sidebar collapsed */}
            </div>
          )
        ) : (
          <NavLink to="/login" style={styles.navLink}>
            Sign in
          </NavLink>
        )}

        {/* Close button for mobile */}
        {isMobile && mobileSidebarOpen && (
          <button style={styles.closeSidebarButton} onClick={closeMobileSidebar} aria-label="Close sidebar">
            <FiX size={18} />
          </button>
        )}
      </aside>

      <div style={styles.content}>
        <header style={styles.topbar} role="banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button style={styles.menuButton} onClick={toggleSidebar} aria-label="Open menu">
                <FiMenu size={18} />
              </button>
            )}
            <h1 style={styles.pageTitle}>{getPageTitle()}</h1>
          </div>
        </header>
        <main
          id="main"
          tabIndex="-1"
          role="main"
          style={{
            padding: isMobile ? '20px 16px' : '32px',
            minHeight: 'calc(100vh - 80px)',
            maxWidth: '100%',
            overflowX: 'hidden',
            background: '#19a0f7',
          }}
        >
          <Routes>
            <Route path="/kanban/:name" element={<KanbanBoard />} />
            <Route path="/backlog/:id" element={<Backlog />} />
            <Route path="/issues/new" element={<IssueCreate />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/assets" element={<Assets />} />
            {/* <Route path="/timeline" element={<Timeline />} /> */} {/* Commented out - Timeline removed from sidebar */}
            <Route path="/users" element={<Users />} />
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
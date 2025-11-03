// this code is ok 


// import React, { useEffect, useState } from 'react';
// import { listUsers, addUser, updateUser, deleteUser } from '../../services/mockApi';
// import { v4 as uuidv4 } from 'uuid';
// import {
//   FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiUpload,
//   FiPlus, FiMinus
// } from 'react-icons/fi';

// const ROLES_KEY = 'user-management-roles';
// const DEPARTMENTS_KEY = 'user-management-departments';

// const defaultRoles = ['Admin', 'Manager', 'Developer', 'Reporter'];
// const defaultDepartments = ['Engineering', 'Sales', 'HR', 'Marketing'];

// function getStored(key, fallback) {
//   const saved = localStorage.getItem(key);
//   try {
//     return saved ? JSON.parse(saved) : fallback;
//   } catch {
//     return fallback;
//   }
// }
// function setStored(key, value) {
//   localStorage.setItem(key, JSON.stringify(value));
// }

// export default function Users() {
//   const defaultNewUser = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: 'Developer',
//     department: 'Engineering',
//     active: true,
//     language: 'English',
//     mobileNumber: '',
//     passwordResetNeeded: false,
//     profileFile: null,
//   };

//   const [users, setUsers] = useState([]);
//   const [newUserForm, setNewUserForm] = useState(defaultNewUser);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);

//   // Roles & Departments state
//   const [roles, setRoles] = useState(() => getStored(ROLES_KEY, defaultRoles));
//   const [departments, setDepartments] = useState(() => getStored(DEPARTMENTS_KEY, defaultDepartments));

//   // Modal state
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [showDepartmentModal, setShowDepartmentModal] = useState(false);
//   const [roleInput, setRoleInput] = useState('');
//   const [departmentInput, setDepartmentInput] = useState('');
//   const [roleToDelete, setRoleToDelete] = useState('');
//   const [departmentToDelete, setDepartmentToDelete] = useState('');

//   // Load users on mount
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await listUsers();
//         setUsers(data);
//       } catch (err) {
//         console.error('Failed to load users:', err);
//         setError('Failed to load users');
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Save roles and departments to localStorage if changed
//   useEffect(() => { setStored(ROLES_KEY, roles); }, [roles]);
//   useEffect(() => { setStored(DEPARTMENTS_KEY, departments); }, [departments]);

//   // Handlers
//   const handleNewUserChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setNewUserForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
//     }));
//   };

//   const handleEditChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
//     }));
//   };

//   const create = async () => {
//     if (!newUserForm.firstName.trim() || !newUserForm.lastName.trim() || !newUserForm.email.trim()) {
//       setError('First Name, Last Name, and Email are required.');
//       return;
//     }
//     try {
//       const newUser = {
//         id: uuidv4(),
//         ...newUserForm,
//         name: `${newUserForm.firstName.trim()} ${newUserForm.lastName.trim()}`,
//         profileFile: newUserForm.profileFile
//           ? { name: newUserForm.profileFile.name, size: newUserForm.profileFile.size }
//           : null
//       };
//       await addUser(newUser);
//       const updatedUsers = await listUsers();
//       setUsers(updatedUsers);
//       setNewUserForm(defaultNewUser);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to add user:', err);
//       setError('Failed to add user');
//     }
//   };

//   const startEdit = (u) => {
//     setEditingId(u.id);
//     setEditForm({ ...u });
//     setError(null);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({});
//     setError(null);
//   };

//   const saveEdit = async (id) => {
//     if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()) {
//       setError('First Name, Last Name, and Email cannot be empty.');
//       return;
//     }
//     try {
//       const updatedUser = {
//         ...editForm,
//         name: `${editForm.firstName.trim()} ${editForm.lastName.trim()}`,
//         profileFile: editForm.profileFile && editForm.profileFile.name
//           ? { name: editForm.profileFile.name, size: editForm.profileFile.size }
//           : editForm.profileFile
//       };
//       await updateUser(updatedUser);
//       const updatedUsers = await listUsers();
//       setUsers(updatedUsers);
//       cancelEdit();
//       setError(null);
//     } catch (err) {
//       console.error('Failed to update user:', err);
//       setError('User not found or failed to update');
//     }
//   };

//   const remove = async (id) => {
//     try {
//       await deleteUser(id);
//       const updatedUsers = await listUsers();
//       setUsers(updatedUsers);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to delete user:', err);
//       setError('User not found or failed to delete');
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (user.name && user.name.toLowerCase().includes(searchLower)) ||
//       (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
//       (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
//       (user.email && user.email.toLowerCase().includes(searchLower)) ||
//       (user.role && user.role.toLowerCase().includes(searchLower)) ||
//       (user.department && user.department.toLowerCase().includes(searchLower))
//     );
//   });

//   const getRoleColor = (roleOrDepartment) => {
//     const colors = {
//       'admin': 'role-admin',
//       'manager': 'role-manager',
//       'developer': 'role-developer',
//       'reporter': 'role-reporter',
//       'engineering': 'role-developer',
//       'sales': 'role-sales',
//       'hr': 'role-hr',
//       'marketing': 'role-marketing'
//     };
//     return colors[roleOrDepartment.toLowerCase()] || '';
//   };

//   // ---- Modal handlers ----
//   // Role modals
//   const openRoleModal = () => { setShowRoleModal(true); setRoleInput(''); setRoleToDelete(''); };
//   const closeRoleModal = () => { setShowRoleModal(false); setRoleInput(''); setRoleToDelete(''); };

//   const addRole = () => {
//     const v = roleInput.trim();
//     if (v && !roles.includes(v)) {
//       setRoles([...roles, v]);
//       setRoleInput('');
//     }
//   };
//   const deleteRole = (r) => {
//     setRoles(roles.filter(role => role !== r));
//     // Optionally, update forms if current value is deleted
//     if (newUserForm.role === r) setNewUserForm(prev => ({ ...prev, role: roles[0] || '' }));
//     if (editForm.role === r) setEditForm(prev => ({ ...prev, role: roles[0] || '' }));
//     setRoleToDelete('');
//   };

//   // Department modals
//   const openDepartmentModal = () => { setShowDepartmentModal(true); setDepartmentInput(''); setDepartmentToDelete(''); };
//   const closeDepartmentModal = () => { setShowDepartmentModal(false); setDepartmentInput(''); setDepartmentToDelete(''); };

//   const addDepartment = () => {
//     const v = departmentInput.trim();
//     if (v && !departments.includes(v)) {
//       setDepartments([...departments, v]);
//       setDepartmentInput('');
//     }
//   };
//   const deleteDepartment = (d) => {
//     setDepartments(departments.filter(dep => dep !== d));
//     if (newUserForm.department === d)
//       setNewUserForm(prev => ({ ...prev, department: departments[0] || '' }));
//     if (editForm.department === d)
//       setEditForm(prev => ({ ...prev, department: departments[0] || '' }));
//     setDepartmentToDelete('');
//   };

//   return (
//     <div className="users-container">
//       <style jsx global>{`
//         body { background: #D8F7FA; min-height: 100vh; }
//       `}</style>
//       {/* Header */}
//       <div className="users-header">
//         <h1 className="users-title">User Management System 🧑‍💼</h1>
//         <p className="users-subtitle">Manage your team members, roles, and administrative settings.</p>
//         {error && <p className="error-message">{error}</p>}
//       </div>
//       <div className="users-grid">
//         {/* ---- FORM SECTION ---- */}
//         <div className="users-form-card glassmorphism" aria-labelledby="users-form-title">
//           <div className="card-header">
//             <h2 id="users-form-title" className="card-title">
//               <FiUserPlus className="icon-spacing" /> Add New User
//             </h2>
//           </div>
//           <div className="form-grid-expanded">
//             {/* Standard fields */}
//             <div className="input-group">
//               <label className="input-label">Full Name *</label>
//               <input className="modern-input" name="firstName"
//                 value={newUserForm.firstName}
//                 onChange={handleNewUserChange}
//                 placeholder="Full Name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Email Address *</label>
//               <input className="modern-input" name="email"
//                 value={newUserForm.email}
//                 onChange={handleNewUserChange}
//                 placeholder="Email Address"
//                 type="email"
//               />
//             </div>
//             <div className="input-group">
//               <label className="input-label">Mobile Number</label>
//               <input className="modern-input" name="mobileNumber"
//                 value={newUserForm.mobileNumber}
//                 onChange={handleNewUserChange}
//                 placeholder="Mobile Number"
//                 type="tel"
//               />
//             </div>
//             {/* Role dropdown with add/delete buttons */}
//             <div className="input-group" style={{ position: 'relative' }}>
//               <label className="input-label">Role
//                 <FiPlus style={{ cursor: 'pointer', marginLeft: 8, color: '#667eea' }}
//                   onClick={openRoleModal} title="Edit roles" />
//               </label>
//               <select className="modern-select" name="role"
//                 value={newUserForm.role}
//                 onChange={handleNewUserChange}>
//                 {roles.map(r => (
//                   <option key={r}>{r}</option>
//                 ))}
//               </select>
//             </div>
//             {/* Department dropdown with add/delete buttons */}
//             <div className="input-group" style={{ position: 'relative' }}>
//               <label className="input-label">Department
//                 <FiPlus style={{ cursor: 'pointer', marginLeft: 8, color: '#667eea' }}
//                   onClick={openDepartmentModal} title="Edit departments" />
//               </label>
//               <select className="modern-select" name="department"
//                 value={newUserForm.department}
//                 onChange={handleNewUserChange}>
//                 {departments.map(d => (
//                   <option key={d}>{d}</option>
//                 ))}
//               </select>
//             </div>


//             <div className="input-group checkbox-group">
//               <label className="input-label">User Status</label>
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="active"
//                   checked={newUserForm.active}
//                   onChange={handleNewUserChange}
//                 />
//                 <span className="checkbox-text">{newUserForm.active ? 'Active' : 'Inactive'}</span>
//               </label>
//             </div>
//             <div className="input-group checkbox-group">
//               <label className="input-label">Password Reset</label>
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="passwordResetNeeded"
//                   checked={newUserForm.passwordResetNeeded}
//                   onChange={handleNewUserChange}
//                 />
//                 <span className="checkbox-text">Reset on next login</span>
//               </label>
//             </div>
//           </div>
//           <button className="create-btn" onClick={create}>
//             <FiUserPlus className="btn-icon" />
//             Create User
//           </button>
//         </div>
//         {/* ---- LIST SECTION ---- */}
//         <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
//           <div className="card-header">
//             <h2 id="users-list-title" className="card-title">
//               Team Members ({filteredUsers.length})
//             </h2>
//             <div className="search-container">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="table-container">
//             <table className="modern-table" role="table" aria-label="Users table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Department</th>
//                   <th>Role</th>
//                   <th>Active</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map(u => (
//                   <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
//                     {editingId === u.id ? (
//                       <>
//                         <td>
//                           <input className="edit-input" name="firstName"
//                             value={editForm.firstName || ''}
//                             onChange={handleEditChange}
//                             placeholder="First Name"
//                           />

//                         </td>
//                         <td>
//                           <input className="edit-input" name="email"
//                             value={editForm.email || ''}
//                             onChange={handleEditChange}
//                           />
//                         </td>
//                         <td>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                             <select className="edit-select"
//                               name="department"
//                               value={editForm.department || defaultNewUser.department}
//                               onChange={handleEditChange}>
//                               {departments.map(d => (
//                                 <option key={d}>{d}</option>
//                               ))}
//                             </select>
//                             <FiPlus style={{ cursor: 'pointer', color: '#667eea' }}
//                               onClick={openDepartmentModal} title="Edit departments" />
//                           </div>
//                         </td>
//                         <td>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                             <select className="edit-select"
//                               name="role"
//                               value={editForm.role || defaultNewUser.role}
//                               onChange={handleEditChange}>
//                               {roles.map(r => (
//                                 <option key={r}>{r}</option>
//                               ))}
//                             </select>
//                             <FiPlus style={{ cursor: 'pointer', color: '#667eea' }}
//                               onClick={openRoleModal} title="Edit roles" />
//                           </div>
//                         </td>
//                         <td>
//                           <input type="checkbox"
//                             name="active"
//                             checked={editForm.active || false}
//                             onChange={handleEditChange}
//                           />
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>
//                           <div className="user-info">
//                             <div className="avatar">{u.firstName ? u.firstName.charAt(0) : (u.name ? u.name.charAt(0) : 'U')}</div>
//                             <span>{u.firstName || u.name} {u.lastName}</span>
//                             <div className="file-indicator" title={u.profileFile ? `File: ${u.profileFile.name}` : 'No file'}>
//                               {u.profileFile && '📁'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>{u.email}</td>
//                         <td>
//                           <span className={`role-badge ${getRoleColor(u.department || 'engineering')}`}>
//                             {u.department}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`role-badge ${getRoleColor(u.role || 'developer')}`}>
//                             {u.role}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`status-dot ${u.active ? 'status-active' : 'status-inactive'}`}></span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
//                               <FiEdit2 />
//                             </button>
//                             <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {filteredUsers.length === 0 && (
//               <div className="empty-state">
//                 <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* ------ MODALS ------ */}
//       {showRoleModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Edit Roles</h3>
//             <div style={{ marginBottom: 12 }}>
//               <input type="text"
//                 placeholder="Add new role"
//                 className="modern-input"
//                 value={roleInput}
//                 onChange={e => setRoleInput(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && addRole()}
//               />
//               <button onClick={addRole} className="create-btn" style={{ marginTop: 8, fontSize: '1rem' }}>Add</button>
//             </div>
//             <div>
//               {roles.map(r => (
//                 <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
//                   <span>{r}</span>
//                   <FiMinus style={{ cursor: 'pointer', color: '#e53e3e' }}
//                     title="Delete role"
//                     onClick={() => setRoleToDelete(r)}
//                   />
//                   {roleToDelete === r && (
//                     <span style={{ marginLeft: 6 }}>
//                       Delete?
//                       <button className="btn-delete" onClick={() => deleteRole(r)} style={{ marginLeft: 3, fontSize: '0.9rem' }}>Yes</button>
//                       <button className="btn-cancel" style={{ marginLeft: 3, fontSize: '0.9rem' }} onClick={() => setRoleToDelete('')}>No</button>
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <button className="btn-cancel" style={{ marginTop: 16 }} onClick={closeRoleModal}>Close</button>
//           </div>
//         </div>
//       )}
//       {showDepartmentModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Edit Departments</h3>
//             <div style={{ marginBottom: 12 }}>
//               <input type="text"
//                 placeholder="Add new department"
//                 className="modern-input"
//                 value={departmentInput}
//                 onChange={e => setDepartmentInput(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && addDepartment()}
//               />
//               <button onClick={addDepartment} className="create-btn" style={{ marginTop: 8, fontSize: '1rem' }}>Add</button>
//             </div>
//             <div>
//               {departments.map(d => (
//                 <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
//                   <span>{d}</span>
//                   <FiMinus
//                     style={{ cursor: 'pointer', color: '#e53e3e' }}
//                     title="Delete department"
//                     onClick={() => setDepartmentToDelete(d)}
//                   />
//                   {departmentToDelete === d && (
//                     <span style={{ marginLeft: 6 }}>
//                       Delete?
//                       <button className="btn-delete" onClick={() => deleteDepartment(d)} style={{ marginLeft: 3, fontSize: '0.9rem' }}>Yes</button>
//                       <button className="btn-cancel" style={{ marginLeft: 3, fontSize: '0.9rem' }} onClick={() => setDepartmentToDelete('')}>No</button>
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <button className="btn-cancel" style={{ marginTop: 16 }} onClick={closeDepartmentModal}>Close</button>
//           </div>
//         </div>
//       )}
//       {/* --- Modal Styles --- */}
//       <style jsx>{`
//         .modal-overlay {
//           position: fixed; top: 0; left: 0; right: 0; bottom: 0;
//           background: rgba(0,0,0,.15);
//           z-index: 1100;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//         .modal-content {
//           background: #fff;
//           border-radius: 12px;
//           padding: 30px 35px;
//           box-shadow: 0 8px 32px rgba(0,0,0,.15);
//           min-width: 350px;
//           max-width: 95vw;
//           font-size: 1.03rem;
//           color: #2d3748;
//         }
//         .modal-content h3 { margin-top:0; font-size:1.18em; margin-bottom:0.9em; }
//         .modal-content input { margin-bottom:6px; }

       
//         .users-container {
//           min-height: 100vh;
//           background: #D8F7FA;
//           padding: 20px;
//         }
//         /* ... (rest of your unchanged styles remain here) ... */
//         .users-header {
//           text-align: center;
//           margin-bottom: 40px;
//           color: #2d3748;
//         }
//         .users-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }
//         .users-subtitle {
//           font-size: 1.1rem;
//           opacity: 0.8;
//           color: #4a5568;
//         }
//         .error-message {
//             color: #e53e3e;
//             background: #fed7d7;
//             padding: 8px 15px;
//             border-radius: 8px;
//             margin-top: 15px;
//             display: inline-block;
//             font-weight: 500;
//         }
//         .users-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 30px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }
//         @media (min-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 450px 1fr;
//           }
//         }
//         .glassmorphism {
//           background: rgba(255, 255, 255, 0.95);

//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
//         }
//         .users-form-card,
//         .users-list-card {
//           padding: 30px;
//         }
//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 15px;
//         }
//         .card-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #2d3748;
//           display: flex;
//           align-items: center;
//         }
//         .icon-spacing {
//           margin-right: 10px;
//         }
//         .form-grid-expanded {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 20px;
//           margin-bottom: 30px;
//         }
//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }
//         .input-label {
//           font-weight: 500;
//           margin-bottom: 8px;
//           color: #4a5568;
//         }
//         .checkbox-group {
//             grid-column: span 1;
//         }
//         .checkbox-label {
//             display: flex;
//             align-items: center;
//             font-weight: 400;
//             color: #4a5568;
//             cursor: pointer;
//             padding: 10px;
//             border-radius: 8px;
//         }
//         .checkbox-label input[type="checkbox"] {
//             margin-right: 10px;
//             width: 18px;
//             height: 18px;
//             accent-color: #667eea;
//         }
//         .file-group input[type="file"] {
//           display: none;
//         }
//         .file-upload-btn {
//           padding: 12px 16px;
//           border: 2px solid #667eea;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 500;
//           color: #667eea;
//           background: #ebf4ff;
//           cursor: pointer;
//           transition: background-color 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: flex-start;
//         }
//         .file-upload-btn:hover {
//           background: #d4e3ff;
//         }
//         .file-upload-btn .btn-icon {
//           margin-right: 8px;
//           font-size: 1.2rem;
//         }
//         .modern-input,
//         .modern-select {
//           padding: 12px 16px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           // background: #D8F7FA;
//           width: 100%;
//           box-sizing: border-box;
//         }
//         .modern-input:focus,
//         .modern-select:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }
//         .create-btn {
//           grid-column: 1 / -1;
//           width: 100%;
//           padding: 14px;
//           background: #4e54c8;
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .create-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }
//         .btn-icon {
//           margin-right: 8px;
//         }
//         .search-container {
//           position: relative;
//           min-width: 250px;
//         }
//         .search-input {
//           padding: 12px 16px 12px 40px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           width: 100%;
//           transition: all 0.3s ease;
//         }
//         .search-input:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }
//         .search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #a0aec0;
//         }
//         .table-container {
//           border-radius: 10px;
//           /* Removed overflow-x to prevent horizontal scroll */
//         }
//         .modern-table {
//           width: 100%;
//           border-collapse: collapse;
//           table-layout: auto; /* Changed from fixed or default to auto */
//           /* Removed min-width */
//         }
//         .modern-table th {
//           background: #f7fafc;
//           padding: 12px 8px; /* Slightly reduce padding for smaller widths */
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 2px solid #e2e8f0;
//           word-wrap: break-word;
//         }
//         .modern-table td {
//           padding: 12px 8px; /* Adjust padding */
//           border-bottom: 1px solid #e2e8f0;
//           vertical-align: middle;
//           word-wrap: break-word;
//           white-space: normal;
//         }
//         .modern-table tr:hover {
//           background: #D8F7FA;
//         }
//         .editing-row {
//           background: #fff9e6 !important;
//         }
//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           flex-wrap: wrap;
//           white-space: normal;
//         }
//         .file-indicator {
//             font-size: 1.1em;
//             cursor: help;
//           white-space: nowrap;
//         }
//         .avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background:#4e54c8;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 1.1rem;
//           flex-shrink: 0;
//         }
//         .status-dot {
//             height: 10px;
//             width: 10px;
//             border-radius: 50%;
//             display: inline-block;
//             margin-right: 5px;
//         }
//         .status-active {
//             background-color: #48bb78;
//         }
//         .status-inactive {
//             background-color: #e53e3e;
//         }
//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 500;
//           white-space: nowrap;
//         }
//         .role-admin {
//           background: #fed7d7;
//           color: #c53030;
//         }
//         .role-manager {
//           background: #feebc8;
//           color: #d69e2e;
//         }
//         .role-developer, .role-engineering {
//           background: #c6f6d5;
//           color: #276749;
//         }
//         .role-reporter {
//           background: #e9d8fd;
//           color: #6b46c1;
//         }
//         .role-sales {
//             background: #bee3f8;
//             color: #2c5282;
//         }
//         .role-hr {
//             background: #fff0f5;
//             color: #d53f8c;
//         }
//         .role-marketing {
//             background: #faf089;
//             color: #744210;
//         }
//         .action-buttons {
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//         }
//         .btn-edit,
//         .btn-delete,
//         .btn-success,
//         .btn-cancel {
//           padding: 8px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .btn-edit {
//           background: #e6fffa;
//           color: #234e52;
//         }
//         .btn-edit:hover {
//           background: #b2f5ea;
//         }
//         .btn-delete {
//           background: #fed7d7;
//           color: #c53030;
//         }
//         .btn-delete:hover {
//           background: #feb2b2;
//         }
//         .btn-success {
//           background: #c6f6d5;
//           color: #276749;
//         }
//         .btn-success:hover {
//           background: #9ae6b4;
//         }
//         .btn-cancel {
//           background: #fed7d7;
//           color: #c53030;
//         }
//         .btn-cancel:hover {
//           background: #feb2b2;
//         }
//         .edit-input,
//         .edit-select {
//           padding: 8px 12px;
//           border: 2px solid #e2e8f0;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 0.9rem;
//           box-sizing: border-box;
//         }
//         .edit-input:focus,
//         .edit-select:focus {
//           outline: none;
//           border-color: #667eea;
//         }
//         .empty-state {
//           text-align: center;
//           padding: 40px;
//           color: #a0aec0;
//           font-style: italic;
//         }
//         @media (max-width: 1024px) {
//           .form-grid-expanded {
//             grid-template-columns: 1fr;
//           }
//           .users-grid {
//             grid-template-columns: 1fr;
//           }
//         }
//         @media (max-width: 768px) {
//           .users-container {
//             padding: 10px;
//           }
//           .users-title {
//             font-size: 2rem;
//           }
//           .users-form-card,
//           .users-list-card {
//             padding: 20px;
//           }
//           .card-header {
//             flex-direction: column;
//             align-items: stretch;
//           }
//           .search-container {
//             min-width: auto;
//           }
//           .modern-table {
//             font-size: 0.85rem;
//           }
//           .modern-table th,
//           .modern-table td {
//             padding: 8px 6px;
//           }
//           .action-buttons {
//             flex-direction: row;
//           }
//           .user-info {
//             gap: 6px;
//           }
//         }
//         @media (max-width: 480px) {
//           .users-title {
//             font-size: 1.75rem;
//           }
//           .card-title {
//             font-size: 1.25rem;
//           }
//           .user-info {
//             flex-direction: column;
//             text-align: center;
//             align-items: flex-start;
//           }
//           .avatar {
//             width: 32px;
//             height: 32px;
//             font-size: 1rem;
//           }
//         }
      
//       `}</style>
//     </div>
//   );
// }













// update the 21/10


import React, { useEffect, useState } from 'react';
import { listUsers, addUser, updateUser, deleteUser } from '../../services/userApi';
import { getUsersFromManagement, updateUserProfile, createUserProfile, getUserProfileByEmail, deleteUserFromManagement } from '../../services/userProfileApi';
import { v4 as uuidv4 } from 'uuid';
import {
  FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch,
  FiPlus, FiMinus
} from 'react-icons/fi';

const ROLES_KEY = 'user-management-roles';
const DEPARTMENTS_KEY = 'user-management-departments';

const defaultRoles = [
  "Associate Developer",
  "Senior Developer",
  "HR",
  "Administration"
];
const defaultDepartments = [
  "Front End",
  "Back End",
  "Middle Ware",
  "AI/ML",
  "Flow Track",
  "DevOps",
  "Networking",
  "Testing",
  "HR",
  "Marketing"
];

function getStored(key, fallback) {
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}
function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Users() {
  const defaultNewUser = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'Developer',
    department: 'Engineering',
    active: true,
    language: 'English',
    mobileNumber: '',
    passwordResetNeeded: false,
    profileFile: null,
  };

  const [users, setUsers] = useState([]);
  const [newUserForm, setNewUserForm] = useState(defaultNewUser);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Roles & Departments state - Reset to new defaults
  const [roles, setRoles] = useState(() => {
    // Clear old stored values and use new defaults
    localStorage.removeItem(ROLES_KEY);
    return defaultRoles;
  });
  const [departments, setDepartments] = useState(() => {
    // Clear old stored values and use new defaults
    localStorage.removeItem(DEPARTMENTS_KEY);
    return defaultDepartments;
  });

  // Modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [roleInput, setRoleInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [roleToDelete, setRoleToDelete] = useState('');
  const [departmentToDelete, setDepartmentToDelete] = useState('');

  // Load users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from users_management table (created by user frontend)
        const realUsers = await getUsersFromManagement();
        console.log('Fetched users from users_management:', realUsers);
        
        // Transform to match the expected format for the UI
        const transformedUsers = realUsers.map(user => ({
          id: user.id.toString(),
          firstName: user.first_name,
          lastName: user.last_name,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email,
          role: user.role,
          department: user.department,
          active: user.active,
          language: user.language || 'English',
          mobileNumber: user.mobile_number,
          dateFormat: user.date_format || 'YYYY-MM-DD',
          passwordResetNeeded: user.password_reset_needed,
          profileFile: user.profile_file_name ? {
            name: user.profile_file_name,
            size: user.profile_file_size
          } : null,
          created_at: user.created_at,
          updated_at: user.updated_at
        }));
        
        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  // Save roles and departments to localStorage if changed
  useEffect(() => { setStored(ROLES_KEY, roles); }, [roles]);
  useEffect(() => { setStored(DEPARTMENTS_KEY, departments); }, [departments]);

  // Handlers
  const handleNewUserChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewUserForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
    }));
  };

  const create = async () => {
    if (!newUserForm.firstName.trim() || !newUserForm.lastName.trim() || !newUserForm.email.trim()) {
      setError('First Name, Last Name, and Email are required.');
      return;
    }
    try {
      const newUser = {
        id: uuidv4(),
        ...newUserForm,
        name: `${newUserForm.firstName.trim()} ${newUserForm.lastName.trim()}`,
        profileFile: newUserForm.profileFile
          ? { name: newUserForm.profileFile.name, size: newUserForm.profileFile.size }
          : null
      };
      await addUser(newUser);
      const updatedUsers = await listUsers();
      setUsers(updatedUsers);
      setNewUserForm(defaultNewUser);
      setError(null);
    } catch (err) {
      console.error('Failed to add user:', err);
      setError('Failed to add user');
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ ...u });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError(null);
  };

  const saveEdit = async (id) => {
    if (!editForm.firstName.trim() || !editForm.email.trim()) {
      setError('First Name and Email cannot be empty.');
      return;
    }
    try {
      // Prepare user profile data for user_profile table
      const profileData = {
        full_name: `${editForm.firstName.trim()} ${editForm.lastName || ''}`.trim(),
        email: editForm.email,
        mobile_number: editForm.mobileNumber || null,
        role: editForm.role,
        department: editForm.department,
        date_of_birth: null, // Can be added if needed
        user_status: editForm.active ? "Active" : "Inactive"
      };
      
      console.log('Admin editing user profile:', profileData);
      
      // Check if user profile already exists in user_profile table
      const existingProfile = await getUserProfileByEmail(editForm.email);
      
      if (existingProfile) {
        // Profile exists - UPDATE it
        console.log('Updating existing user profile, user_id:', existingProfile.user_id);
        await updateUserProfile(existingProfile.user_id, profileData);
        console.log('Successfully updated user profile in user_profile table');
      } else {
        // Profile doesn't exist - CREATE it
        console.log('Creating new user profile in user_profile table');
        await createUserProfile(profileData);
        console.log('Successfully created user profile in user_profile table');
      }
      
      // The backend automatically syncs changes back to users_management table
      // Now refresh the users list from users_management table
      const realUsers = await getUsersFromManagement();
      const transformedUsers = realUsers.map(user => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role,
        department: user.department,
        active: user.active,
        language: user.language || 'English',
        mobileNumber: user.mobile_number,
        dateFormat: user.date_format || 'YYYY-MM-DD',
        passwordResetNeeded: user.password_reset_needed,
        profileFile: user.profile_file_name ? {
          name: user.profile_file_name,
          size: user.profile_file_size
        } : null
      }));
      
      setUsers(transformedUsers);
      cancelEdit();
      setError(null);
      console.log('User list refreshed successfully');
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user: ' + (err.message || 'Unknown error'));
    }
  };

  const remove = async (id) => {
    try {
      // Delete from users_management table (admin portal uses this table)
      await deleteUserFromManagement(id);
      
      // Refresh the users list from users_management table
      const realUsers = await getUsersFromManagement();
      const transformedUsers = realUsers.map(user => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role,
        department: user.department,
        active: user.active,
        language: user.language || 'English',
        mobileNumber: user.mobile_number,
        dateFormat: user.date_format || 'YYYY-MM-DD',
        passwordResetNeeded: user.password_reset_needed,
        profileFile: user.profile_file_name ? {
          name: user.profile_file_name,
          size: user.profile_file_size
        } : null
      }));
      
      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('User not found or failed to delete');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower)) ||
      (user.department && user.department.toLowerCase().includes(searchLower))
    );
  });

  const getRoleColor = (roleOrDepartment) => {
    const colors = {
      'admin': 'role-admin',
      'manager': 'role-manager',
      'developer': 'role-developer',
      'reporter': 'role-reporter',
      'engineering': 'role-developer',
      'sales': 'role-sales',
      'hr': 'role-hr',
      'marketing': 'role-marketing',
      'senior associate developer': 'role-developer',
      'associate developer': 'role-developer',
      'frontend': 'role-developer',
      'backend': 'role-developer',
      'middleware': 'role-developer',
      'aiml': 'role-developer',
      'devops': 'role-developer',
      'testing': 'role-developer',
      'flowtrack': 'role-developer',
      'network': 'role-developer',
      'administrator': 'role-admin',
    };
    return colors[roleOrDepartment.toLowerCase()] || '';
  };

  // ---- Modal handlers ----
  // Role modals
  const openRoleModal = () => { setShowRoleModal(true); setRoleInput(''); setRoleToDelete(''); };
  const closeRoleModal = () => { setShowRoleModal(false); setRoleInput(''); setRoleToDelete(''); };

  const addRole = () => {
    const v = roleInput.trim();
    if (v && !roles.includes(v)) {
      setRoles([...roles, v]);
      setRoleInput('');
    }
  };
  const deleteRole = (r) => {
    setRoles(roles.filter(role => role !== r));
    if (newUserForm.role === r) setNewUserForm(prev => ({ ...prev, role: roles[0] || '' }));
    if (editForm.role === r) setEditForm(prev => ({ ...prev, role: roles[0] || '' }));
    setRoleToDelete('');
  };

  // Department modals
  const openDepartmentModal = () => { setShowDepartmentModal(true); setDepartmentInput(''); setDepartmentToDelete(''); };
  const closeDepartmentModal = () => { setShowDepartmentModal(false); setDepartmentInput(''); setDepartmentToDelete(''); };

  const addDepartment = () => {
    const v = departmentInput.trim();
    if (v && !departments.includes(v)) {
      setDepartments([...departments, v]);
      setDepartmentInput('');
    }
  };
  const deleteDepartment = (d) => {
    setDepartments(departments.filter(dep => dep !== d));
    if (newUserForm.department === d)
      setNewUserForm(prev => ({ ...prev, department: departments[0] || '' }));
    if (editForm.department === d)
      setEditForm(prev => ({ ...prev, department: departments[0] || '' }));
    setDepartmentToDelete('');
  };

  return (
    <div className="users-container">
      <style jsx global>{`
        body { background: #D8F7FA; min-height: 100vh; }
      `}</style>
      {/* Header */}
      <div className="users-header">
        <h1 className="users-title">User Management System 🧑‍💼</h1>
        <p className="users-subtitle">Manage your team members, roles, and administrative settings.</p>
        <p className="users-subtitle" style={{ fontSize: '0.95rem', marginTop: '10px', color: '#667eea' }}>
          Note: All user details can be edited except email (unique identifier)
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="users-grid">
        {/* LIST SECTION */}
        <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
          <div className="card-header">
            <h2 id="users-list-title" className="card-title">
              Team Members ({filteredUsers.length})
            </h2>
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="table-container">
            <table className="modern-table" role="table" aria-label="Users table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
                    {editingId === u.id ? (
                      <>
                        <td>
                          <input className="edit-input" name="firstName"
                            value={editForm.firstName || ''}
                            onChange={handleEditChange}
                            placeholder="First Name"
                          />
                        </td>
                        <td>
                          <input className="edit-input" name="email"
                            value={editForm.email || ''}
                            onChange={handleEditChange}
                            disabled
                            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                            title="Email cannot be edited (unique identifier)"
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <select className="edit-select"
                              name="department"
                              value={editForm.department || defaultNewUser.department}
                              onChange={handleEditChange}>
                              {departments.map(d => (
                                <option key={d}>{d}</option>
                              ))}
                            </select>
                            <FiPlus style={{ cursor: 'pointer', color: '#667eea' }}
                              onClick={openDepartmentModal} title="Edit departments" />
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <select className="edit-select"
                              name="role"
                              value={editForm.role || defaultNewUser.role}
                              onChange={handleEditChange}>
                              {roles.map(r => (
                                <option key={r}>{r}</option>
                              ))}
                            </select>
                            <FiPlus style={{ cursor: 'pointer', color: '#667eea' }}
                              onClick={openRoleModal} title="Edit roles" />
                          </div>
                        </td>
                        <td>
                          <input type="checkbox"
                            name="active"
                            checked={editForm.active || false}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
                              <FiCheck />
                            </button>
                            <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
                              <FiX />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="user-info">
                            <div className="avatar">{u.firstName ? u.firstName.charAt(0) : (u.name ? u.name.charAt(0) : 'U')}</div>
                            <span>{u.firstName || u.name} {u.lastName}</span>
                            <div className="file-indicator" title={u.profileFile ? `File: ${u.profileFile.name}` : 'No file'}>
                              {u.profileFile && '📁'}
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${getRoleColor(u.department || 'engineering')}`}>
                            {u.department}
                          </span>
                        </td>
                        <td>
                          <span className={`role-badge ${getRoleColor(u.role || 'developer')}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-dot ${u.active ? 'status-active' : 'status-inactive'}`}></span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
                              <FiEdit2 />
                            </button>
                            <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Roles</h3>
            <div style={{ marginBottom: 12 }}>
              <input type="text"
                placeholder="Add new role"
                className="modern-input"
                value={roleInput}
                onChange={e => setRoleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRole()}
              />
              <button onClick={addRole} className="create-btn" style={{ marginTop: 8, fontSize: '1rem' }}>Add</button>
            </div>
            <div>
              {roles.map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span>{r}</span>
                  <FiMinus style={{ cursor: 'pointer', color: '#e53e3e' }}
                    title="Delete role"
                    onClick={() => setRoleToDelete(r)}
                  />
                  {roleToDelete === r && (
                    <span style={{ marginLeft: 6 }}>
                      Delete?
                      <button className="btn-delete" onClick={() => deleteRole(r)} style={{ marginLeft: 3, fontSize: '0.9rem' }}>Yes</button>
                      <button className="btn-cancel" style={{ marginLeft: 3, fontSize: '0.9rem' }} onClick={() => setRoleToDelete('')}>No</button>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-cancel" style={{ marginTop: 16 }} onClick={closeRoleModal}>Close</button>
          </div>
        </div>
      )}

      {showDepartmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Departments</h3>
            <div style={{ marginBottom: 12 }}>
              <input type="text"
                placeholder="Add new department"
                className="modern-input"
                value={departmentInput}
                onChange={e => setDepartmentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addDepartment()}
              />
              <button onClick={addDepartment} className="create-btn" style={{ marginTop: 8, fontSize: '1rem' }}>Add</button>
            </div>
            <div>
              {departments.map(d => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span>{d}</span>
                  <FiMinus
                    style={{ cursor: 'pointer', color: '#e53e3e' }}
                    title="Delete department"
                    onClick={() => setDepartmentToDelete(d)}
                  />
                  {departmentToDelete === d && (
                    <span style={{ marginLeft: 6 }}>
                      Delete?
                      <button className="btn-delete" onClick={() => deleteDepartment(d)} style={{ marginLeft: 3, fontSize: '0.9rem' }}>Yes</button>
                      <button className="btn-cancel" style={{ marginLeft: 3, fontSize: '0.9rem' }} onClick={() => setDepartmentToDelete('')}>No</button>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-cancel" style={{ marginTop: 16 }} onClick={closeDepartmentModal}>Close</button>
          </div>
        </div>
      )}

      {/* --- Modal Styles --- */}
      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,.15);
          z-index: 1100;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 30px 35px;
          box-shadow: 0 8px 32px rgba(0,0,0,.15);
          min-width: 350px;
          max-width: 95vw;
          font-size: 1.03rem;
          color: #2d3748;
        }
        .modal-content h3 { margin-top:0; font-size:1.18em; margin-bottom:0.9em; }
        .modal-content input { margin-bottom:6px; }

        .users-container {
          min-height: 100vh;
          background: #D8F7FA;
          padding: 20px;
        }
        .users-header {
          text-align: center;
          margin-bottom: 40px;
          color: #2d3748;
        }
        .users-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .users-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          color: #4a5568;
        }
        .error-message {
          color: #e53e3e;
          background: #fed7d7;
          padding: 8px 15px;
          border-radius: 8px;
          margin-top: 15px;
          display: inline-block;
          font-weight: 500;
        }
        .users-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }
        .users-form-card,
        .users-list-card {
          padding: 30px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          display: flex;
          align-items: center;
        }
        .icon-spacing {
          margin-right: 10px;
        }
        .form-grid-expanded {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
        }
        .input-label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #4a5568;
        }
        .checkbox-group {
          grid-column: span 1;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          font-weight: 400;
          color: #4a5568;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
        }
        .checkbox-label input[type="checkbox"] {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }
        .file-group input[type="file"] {
          display: none;
        }
        .file-upload-btn {
          padding: 12px 16px;
          border: 2px solid #667eea;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          color: #667eea;
          background: #ebf4ff;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .file-upload-btn:hover {
          background: #d4e3ff;
        }
        .file-upload-btn .btn-icon {
          margin-right: 8px;
          font-size: 1.2rem;
        }
        .modern-input,
        .modern-select {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .modern-input:focus,
        .modern-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .create-btn {
          grid-column: 1 / -1;
          width: 100%;
          padding: 14px;
          background: #4e54c8;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .btn-icon {
          margin-right: 8px;
        }
        .search-container {
          position: relative;
          min-width: 250px;
        }
        .search-input {
          padding: 12px 16px 12px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          width: 100%;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
        }
        .table-container {
          border-radius: 10px;
        }
        .modern-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
        }
        .modern-table th {
          background: #f7fafc;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
          word-wrap: break-word;
        }
        .modern-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
          word-wrap: break-word;
          white-space: normal;
        }
        .modern-table tr:hover {
          background: #D8F7FA;
        }
        .editing-row {
          background: #fff9e6 !important;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          white-space: normal;
        }
        .file-indicator {
          font-size: 1.1em;
          cursor: help;
          white-space: nowrap;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background:#4e54c8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .status-dot {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }
        .status-active {
          background-color: #48bb78;
        }
        .status-inactive {
          background-color: #e53e3e;
        }
        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .role-admin {
          background: #fed7d7;
          color: #c53030;
        }
        .role-manager {
          background: #feebc8;
          color: #d69e2e;
        }
        .role-developer, .role-engineering {
          background: #c6f6d5;
          color: #276749;
        }
        .role-reporter {
          background: #e9d8fd;
          color: #6b46c1;
        }
        .role-sales {
          background: #bee3f8;
          color: #2c5282;
        }
        .role-hr {
          background: #fff0f5;
          color: #d53f8c;
        }
        .role-marketing {
          background: #faf089;
          color: #744210;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-edit,
        .btn-delete,
        .btn-success,
        .btn-cancel {
          padding: 8px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-edit {
          background: #e6fffa;
          color: #234e52;
        }
        .btn-edit:hover {
          background: #b2f5ea;
        }
        .btn-delete {
          background: #fed7d7;
          color: #c53030;
        }
        .btn-delete:hover {
          background: #feb2b2;
        }
        .btn-success {
          background: #c6f6d5;
          color: #276749;
        }
        .btn-success:hover {
          background: #9ae6b4;
        }
        .btn-cancel {
          background: #fed7d7;
          color: #c53030;
        }
        .btn-cancel:hover {
          background: #feb2b2;
        }
        .edit-input,
        .edit-select {
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          width: 100%;
          font-size: 0.9rem;
          box-sizing: border-box;
        }
        .edit-input:focus,
        .edit-select:focus {
          outline: none;
          border-color: #667eea;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #a0aec0;
          font-style: italic;
        }
        @media (max-width: 1024px) {
          .form-grid-expanded {
            grid-template-columns: 1fr;
          }
          .users-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .users-container {
            padding: 10px;
          }
          .users-title {
            font-size: 2rem;
          }
          .users-form-card,
          .users-list-card {
            padding: 20px;
          }
          .card-header {
            flex-direction: column;
            align-items: stretch;
          }
          .search-container {
            min-width: auto;
          }
          .modern-table {
            font-size: 0.85rem;
          }
          .modern-table th,
          .modern-table td {
            padding: 8px 6px;
          }
          .action-buttons {
            flex-direction: row;
          }
          .user-info {
            gap: 6px;
          }
        }
        @media (max-width: 480px) {
          .users-title {
            font-size: 1.75rem;
          }
          .card-title {
            font-size: 1.25rem;
          }
          .user-info {
            flex-direction: column;
            text-align: center;
            align-items: flex-start;
          }
          .avatar {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}















// 
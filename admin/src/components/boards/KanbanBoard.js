// ok

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { FiUpload } from 'react-icons/fi'; // Import for upload icon


// const mockIssues = [
//   { id: 'i1', epic: 'p1', epicName: 'Frontend', status: 'todo', type: 'Task', title: 'Setup repo', assignee: 'John Doe', storyPoints: 3, labels: [], dueDate: '2025-09-30', reporter: 'admin', priority: 'High', startDate: '2025-09-15', description: '', subtasks: '', comments: '' },
//   { id: 'i3', epic: 'p2', epicName: 'Middleware', status: 'todo', type: 'Subtask', title: 'API integration', assignee: 'Jane Smith', storyPoints: 2, labels: [], dueDate: '', reporter: 'lead-dev', priority: 'Low', startDate: '2025-09-18', description: '', subtasks: '', comments: '' }
// ];

// const defaultStatuses = ['backlog', 'todo', 'analysis', 'inprogress', 'blocked', 'code review', 'qa', 'milestone', 'done'];
// const mockEpics = [{ id: 'p1', name: 'Frontend' }, { id: 'p2', name: 'Middleware' }];

// const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 200));
// const listIssues = async (projectId) => {
//   await simulateApiDelay();
//   return mockIssues.filter(i => !projectId || i.epic === projectId || i.projectId === projectId);
// };
// const listEpics = async () => { await simulateApiDelay(); return mockEpics; };
// const createEpicAPI = async (epicName) => {
//   await simulateApiDelay();
//   const newEpic = { id: 'p' + (mockEpics.length + 1), name: epicName };
//   mockEpics.push(newEpic);
//   return newEpic;
// };
// const deleteEpicAPI = async (epicId) => {
//   await simulateApiDelay();
//   const epicIndex = mockEpics.findIndex(epic => epic.id === epicId);
//   if (epicIndex > -1) mockEpics.splice(epicIndex, 1);
//   const issueIndices = [];
//   mockIssues.forEach((issue, index) => { if (issue.epic === epicId) issueIndices.push(index); });
//   issueIndices.sort((a, b) => b - a).forEach(index => { mockIssues.splice(index, 1); });
// };
// const moveIssue = async (issueId, status) => {
//   await simulateApiDelay();
//   const issue = mockIssues.find(i => i.id === issueId);
//   if (!issue) throw new Error('Issue not found');
//   issue.status = status;
// };
// const createIssueAPI = async (issue) => { await simulateApiDelay(); mockIssues.push(issue); };
// const deleteIssueAPI = async (issueId) => { await simulateApiDelay(); const idx = mockIssues.findIndex(i => i.id === issueId); if (idx > -1) mockIssues.splice(idx, 1); };
// const updateIssueAPI = async (updatedIssue) => { await simulateApiDelay(); const idx = mockIssues.findIndex(i => i.id === updatedIssue.id); if (idx > -1) mockIssues[idx] = { ...mockIssues[idx], ...updatedIssue }; };

// const getSwimlanes = (issues, epics) =>
//   epics.map(epic => {
//     const epicIssues = issues.filter(i => (i.epic || i.projectId) === epic.id);
//     return { id: epic.id, title: epic.name, issues: epicIssues };
//   });

// export default function KanbanBoard() {
//   const { projectId } = useParams();
//   const [profileFile, setProfileFile] = useState(null); // New state for file input
//   const [issues, setIssues] = useState([]);
//   const [epics, setEpics] = useState([]);
//   const [openSwimlanes, setOpenSwimlanes] = useState({});
//   const [customTitles, setCustomTitles] = useState({});
//   const [createLaneId, setCreateLaneId] = useState(null);
//   const [newTaskText, setNewTaskText] = useState('');
//   const [newTaskType, setNewTaskType] = useState('Task');
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [editIssue, setEditIssue] = useState(null);
//   const [showCreateEpic, setShowCreateEpic] = useState(false);
//   const [showDeleteEpic, setShowDeleteEpic] = useState(false);
//   const [newEpicName, setNewEpicName] = useState('');
//   const [epicToDelete, setEpicToDelete] = useState('');
//   const [columnsByLane, setColumnsByLane] = useState({});
//   const [columnModal, setColumnModal] = useState(null);
//   const [columnInput, setColumnInput] = useState('');
//   const [hoveredAssigneeId, setHoveredAssigneeId] = useState(null);
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

//     const handleNewUserChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfileFile(e.target.files[0]);
//       // Also update editIssue if you want to keep the file info within issue object (optional)
//       handleUpdateField('profileFile', e.target.files[0]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       // ...existing fetch logic unchanged
//     };
//     fetchData();
//   }, [projectId]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [issuesData, epicsData] = await Promise.all([listIssues(projectId), listEpics()]);
//         setIssues(issuesData);
//         setEpics(epicsData);
//         const lanes = getSwimlanes(issuesData, epicsData);
//         const initialOpen = {}, initialTitles = {}, initialCols = {};
//         lanes.forEach(lane => {
//           initialOpen[lane.id] = true;
//           initialTitles[lane.id] = lane.title;
//           initialCols[lane.id] = defaultStatuses.slice();
//         });
//         setOpenSwimlanes(initialOpen);
//         setCustomTitles(initialTitles);
//         setColumnsByLane(initialCols);
//       } catch (err) { console.error(err); }
//     };
//     fetchData();
//   }, [projectId]);

//   const openAddColumnModal = (e, laneId, colIndex) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
//     setColumnModal({ laneId, colIndex, type: 'add' });
//     setColumnInput('');
//   };
//   const openEditColumnModal = (e, laneId, colIndex, status) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
//     setColumnModal({ laneId, colIndex, type: 'menu' });
//     setColumnInput(status);
//   };
//   const handleAddColumn = () => {
//     const name = columnInput.trim();
//     if (!name) return alert('Column name is required');
//     setColumnsByLane(prev => {
//       const cols = [...prev[columnModal.laneId]];
//       if (cols.includes(name.toLowerCase())) alert('Column name already exists');
//       else cols.splice(columnModal.colIndex + 1, 0, name.toLowerCase());
//       return { ...prev, [columnModal.laneId]: cols };
//     });
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const handleEditColumn = () => {
//     const name = columnInput.trim();
//     if (!name) return alert('Column name is required');
//     const { laneId, colIndex } = columnModal;
//     const oldCol = columnsByLane[laneId][colIndex];
//     if (columnsByLane[laneId].includes(name.toLowerCase()) && name.toLowerCase() !== oldCol) {
//       alert('Column name already exists');
//       return;
//     }
//     setColumnsByLane(prev => {
//       const cols = [...prev[laneId]];
//       cols[colIndex] = name.toLowerCase();
//       return { ...prev, [laneId]: cols };
//     });
//     const updatedIssues = issues.map(issue =>
//       (issue.epic || issue.projectId) === laneId && issue.status === oldCol ? { ...issue, status: name.toLowerCase() } : issue
//     );
//     setIssues(updatedIssues);
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const handleDeleteColumn = () => {
//     const { laneId, colIndex } = columnModal;
//     const removedCol = columnsByLane[laneId][colIndex];
//     setColumnsByLane(prev => {
//       const cols = [...prev[laneId]];
//       cols.splice(colIndex, 1);
//       return { ...prev, [laneId]: cols };
//     });
//     const updatedIssues = issues.map(issue =>
//       (issue.epic || issue.projectId) === laneId && issue.status === removedCol ? { ...issue, status: 'backlog' } : issue
//     );
//     setIssues(updatedIssues);
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const toggleSwimlane = (id) => setOpenSwimlanes(prev => ({ ...prev, [id]: !prev[id] }));
//   const byStatus = (collection, status) => collection.filter(i => i.status === status);

//   const onDragStart = (e, issueId) => e.dataTransfer.setData('text/plain', issueId);
//   const onDrop = async (e, targetStatus, swimlaneId) => {
//     e.preventDefault();
//     try {
//       const issueId = e.dataTransfer.getData('text/plain');
//       const issue = issues.find(i => i.id === issueId);
//       const srcLaneId = issue.epic || issue.projectId;
//       if (srcLaneId === swimlaneId && issue.status !== targetStatus) {
//         await moveIssue(issueId, targetStatus);
//         const refreshed = await listIssues(projectId);
//         setIssues(refreshed);
//       }
//     } catch (err) { console.error(err); }
//   };
//   const onDragOver = e => e.preventDefault();

//   const handleCreateClick = laneId => { setCreateLaneId(laneId); setNewTaskText(''); setNewTaskType('Task'); };
//   const handleCreateSubmit = async lane => {
//     if (!newTaskText.trim()) { alert('Task title is required'); return; }
//     const newIssue = {
//       id: Math.random().toString(36).slice(2),
//       epic: lane.id,
//       projectId: lane.id,
//       epicName: lane.title,
//       title: newTaskText,
//       status: 'backlog',
//       assignee: '',
//       type: newTaskType,
//       storyPoints: '',
//       labels: [],
//       dueDate: '',
//       reporter: 'system',
//       priority: 'Medium',
//       startDate: new Date().toISOString().split('T')[0],
//       description: '',
//       subtasks: '',
//       comments: ''
//     };
//     try {
//       await createIssueAPI(newIssue);
//       const refreshed = await listIssues(projectId);
//       setIssues(refreshed);
//       setCreateLaneId(null);
//     } catch (err) { console.error(err); }
//   };

//   const handleOpenModal = (issue) => { setSelectedIssue(issue); setEditIssue({ ...issue }); };
//   const handleUpdateField = (field, value) => { setEditIssue(prev => ({ ...prev, [field]: value })); };
//   const handleSave = async () => { await updateIssueAPI(editIssue); const refreshed = await listIssues(projectId); setIssues(refreshed); setSelectedIssue(null); setEditIssue(null); };
//   const handleReset = () => { setEditIssue({ ...selectedIssue }); };

//   // Create Epic Modal Handlers
//   const handleCreateEpic = async () => {
//     if (!newEpicName.trim()) {
//       alert('Epic name is required');
//       return;
//     }
//     try {
//       await createEpicAPI(newEpicName);
//       const updatedEpics = await listEpics();
//       setEpics(updatedEpics);
//       setNewEpicName('');
//       setShowCreateEpic(false);
//       const newEpic = updatedEpics[updatedEpics.length - 1];
//       setOpenSwimlanes(prev => ({ ...prev, [newEpic.id]: true }));
//       setCustomTitles(prev => ({ ...prev, [newEpic.id]: newEpic.name }));
//       setColumnsByLane(prev => ({ ...prev, [newEpic.id]: defaultStatuses.slice() }));
//     } catch (error) {
//       console.error('Error creating epic:', error);
//     }
//   };

//   // Delete Epic Modal Handler
//   const handleDeleteEpic = async () => {
//     if (!epicToDelete) {
//       alert('Please select an epic to delete');
//       return;
//     }
//     if (!window.confirm(`Are you sure you want to delete the epic "${epics.find(e => e.id === epicToDelete)?.name}"? This will also delete all issues in this epic.`)) {
//       return;
//     }
//     try {
//       await deleteEpicAPI(epicToDelete);
//       const [refreshedIssues, refreshedEpics] = await Promise.all([
//         listIssues(projectId),
//         listEpics()
//       ]);
//       setIssues(refreshedIssues);
//       setEpics(refreshedEpics);
//       setEpicToDelete('');
//       setShowDeleteEpic(false);
//       setColumnsByLane(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//       setOpenSwimlanes(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//       setCustomTitles(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//     } catch (error) {
//       console.error('Error deleting epic:', error);
//     }
//   };

//   const swimlanes = getSwimlanes(issues, epics);

//   return (
//     <div className="board-wrap">
//       {/* Epic management buttons */}
//       <div className="epic-management-section">
//         <div className="epic-buttons-container">
//           <button className="create-epic-btn" onClick={() => { setShowCreateEpic(true); setShowDeleteEpic(false); }}>+ Create Epic</button>
//           <button className="delete-epic-btn" onClick={() => { setShowDeleteEpic(true); setShowCreateEpic(false); }}>🗑 Delete Epic</button>
//         </div>

//         {/* Create Epic Modal */}
//         {showCreateEpic && (
//           <div className="epic-modal-overlay" onClick={() => setShowCreateEpic(false)}>
//             <div className="epic-modal" onClick={e => e.stopPropagation()}>
//               <div className="epic-modal-content">
//                 <h3>Create New Epic</h3>
//                 <input type="text" placeholder="Enter epic name" value={newEpicName} onChange={(e) => setNewEpicName(e.target.value)} className="epic-modal-input" autoFocus />
//                 <div className="epic-modal-actions">
//                   <button className="btn-cancel" onClick={() => { setShowCreateEpic(false); setNewEpicName(''); }}>Cancel</button>
//                   <button className="btn-create" onClick={handleCreateEpic}>Create Epic</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Epic Modal */}
//         {showDeleteEpic && (
//           <div className="epic-modal-overlay" onClick={() => setShowDeleteEpic(false)}>
//             <div className="epic-modal" onClick={e => e.stopPropagation()}>
//               <div className="epic-modal-content">
//                 <h3>Delete Epic</h3>
//                 <p className="delete-warning">Select an epic to delete. This will also delete all issues in the epic.</p>
//                 <select value={epicToDelete} onChange={(e) => setEpicToDelete(e.target.value)} className="epic-modal-select">
//                   <option value="">Select an epic...</option>
//                   {epics.map(epic => (
//                     <option key={epic.id} value={epic.id}>{epic.name} ({swimlanes.find(s => s.id === epic.id)?.issues.length || 0} issues)</option>
//                   ))}
//                 </select>
//                 <div className="epic-modal-actions">
//                   <button className="btn-cancel" onClick={() => { setShowDeleteEpic(false); setEpicToDelete(''); }}>Cancel</button>
//                   <button className="btn-delete" onClick={handleDeleteEpic} disabled={!epicToDelete}>Delete Epic</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Swimlanes and columns */}
//       {swimlanes.map(lane => {
//         const isOpen = openSwimlanes[lane.id];
//         const statuses = columnsByLane[lane.id] || defaultStatuses;
//         return (
//           <section className="swimlane" key={lane.id}>
//             <header className="swimlane-header">
//               <button className="swimlane-toggle" onClick={() => toggleSwimlane(lane.id)}>{isOpen ? '▼' : '▶'}</button>
//               <span className="swimlane-icon">⚡</span>
//               <input className="swimlane-title-input" value={customTitles[lane.id] || ''} onChange={e => setCustomTitles(prev => ({ ...prev, [lane.id]: e.target.value }))} />
//               <span className="swimlane-count">{lane.issues.length} work items</span>
//             </header>
//             {isOpen && (
//               <div className="kanban-row">
//                 {statuses.map((status, idx) => {
//                   const issuesForStatus = byStatus(lane.issues, status);
//                   return (
//                     <div className="kanban-column" key={status} onDragOver={onDragOver} onDrop={e => onDrop(e, status, lane.id)}>
//                       <div className="col-header">
//                         <span className="col-title">{status.toUpperCase()}</span>
//                         <span className="col-icons">
//                           <button className="col-icon" title="Add Column" onClick={e => openAddColumnModal(e, lane.id, idx)}>＋</button>
//                           <button className="col-icon" title="Edit/Delete Column" onClick={e => openEditColumnModal(e, lane.id, idx, status)}>⋮</button>
//                         </span>
//                         {issuesForStatus.length > 0 && <span className="col-count">{issuesForStatus.length}</span>}
//                       </div>
//                       <div className="col-create">
//                         {status === 'backlog' && (
//                           createLaneId === lane.id ? (
//                             <div className="create-card">
//                               <textarea rows={2} className="create-input" placeholder="What needs to be done?" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} />
//                               <div className="create-actions">
//                                 <select value={newTaskType} onChange={e => setNewTaskType(e.target.value)} className="create-select">
//                                   <option>Task</option><option>Subtask</option><option>Bug</option>
//                                 </select>
//                                 <button className="create-btn" onClick={() => handleCreateSubmit(lane)}>✔</button>
//                                 <button className="create-btn" onClick={() => setCreateLaneId(null)}>✖</button>
//                               </div>
//                             </div>
//                           ) : (<span className="create-link" onClick={() => handleCreateClick(lane.id)}>+ Create</span>)
//                         )}
//                       </div>
//                       {issuesForStatus.map(issue => {
//                         const isHovered = hoveredAssigneeId === issue.id;
//                         return (
//                           <div className="card-item" key={issue.id} draggable onDragStart={e => onDragStart(e, issue.id)} onClick={() => handleOpenModal(issue)}>
//                             <div className="card-top">
//                               <span className={`card-tag card-tag-${issue.type.toLowerCase()}`}>{issue.type}</span>
//                               <span className="card-id">{issue.id}</span>
//                             </div>
//                             <div className="card-title">{issue.title}</div>
//                             <div className="card-meta">
//                               {issue.dueDate && <span className="card-due">📅 {issue.dueDate}</span>}
//                               <span className={`card-priority ${issue.priority.toLowerCase()}`}>⚑ {issue.priority}</span>
//                               {issue.assignee && (
//                                 <span className="card-assignee" onMouseEnter={() => setHoveredAssigneeId(issue.id)} onMouseLeave={() => setHoveredAssigneeId(null)} style={{ position: 'relative', cursor: 'default', userSelect: 'none' }}>
//                                   👤
//                                   {isHovered && <div className="assignee-tooltip">{issue.assignee}</div>}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>
//         );
//       })}

//       {/* Column Add/Edit modal */}
//       {columnModal && (columnModal.type === 'add' || columnModal.type === 'menu') && (
//         <div className="epic-modal-overlay" onClick={() => setColumnModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
//           <div className="epic-modal" onClick={e => e.stopPropagation()} style={{
//             position: 'absolute',
//             top: modalPosition.top,
//             left: modalPosition.left,
//             transform: 'translateX(-50%)',
//             minWidth: 280,
//             maxWidth: 320,
//             padding: 20,
//             borderRadius: 10,
//             background: 'white',
//             boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
//             zIndex: 1100
//           }}>
//             {columnModal.type === 'add' ? (
//               <>
//                 <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Add Column</h3>
//                 <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
//                 <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
//                   <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
//                   <button className="btn-create" onClick={handleAddColumn} style={btnStyle.create}>Add</button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Edit/Delete Column</h3>
//                 <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
//                 <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
//                   <button className="btn-save" onClick={handleEditColumn} style={btnStyle.create}>Rename</button>
//                   <button className="btn-delete" onClick={handleDeleteColumn} style={btnStyle.delete}>Delete</button>
//                   <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Issue modal */}
//      {/* Issue modal */}
//       {selectedIssue && editIssue && (
//         <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
//           <div className="modal" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>{editIssue.epicName}</h2>
//               <button className="modal-close-btn" onClick={() => setSelectedIssue(null)}>✖</button>
//             </div>
//             <div className="modal-field"><label>Title</label><input value={editIssue.title} onChange={e => handleUpdateField('title', e.target.value)} /></div>
//             <div className="modal-field"><label>Description</label><textarea value={editIssue.description} onChange={e => handleUpdateField('description', e.target.value)} /></div>
//             <div className="modal-field"><label>Subtasks</label><input value={editIssue.subtasks} onChange={e => handleUpdateField('subtasks', e.target.value)} /></div>
//             <div className="modal-field"><label>Comments</label><textarea value={editIssue.comments} onChange={e => handleUpdateField('comments', e.target.value)} /></div>
//             <div className="modal-field">
//               <label>Status</label>
//               <select value={editIssue.status} onChange={e => handleUpdateField('status', e.target.value)}>
//                 {(columnsByLane[editIssue.epic] || defaultStatuses).map(st => <option key={st} value={st}>{st}</option>)}
//               </select>
//             </div>
//             <div className="modal-field"><label>Assignee</label><input value={editIssue.assignee} onChange={e => handleUpdateField('assignee', e.target.value)} /></div>
//             <div className="modal-field"><label>Reporter</label><input disabled value={editIssue.reporter} /></div>
//             <div className="modal-field">
//               <label>Priority</label>
//               <select value={editIssue.priority} onChange={e => handleUpdateField('priority', e.target.value)}>
//                 <option>Low</option><option>Medium</option><option>High</option>
//               </select>
//             </div>
//             <div className="modal-field"><label>Due Date</label><input type="date" value={editIssue.dueDate} onChange={e => handleUpdateField('dueDate', e.target.value)} /></div>
//             <div className="modal-field"><label>Start Date</label><input type="date" value={editIssue.startDate} onChange={e => handleUpdateField('startDate', e.target.value)} /></div>

//             {/* Added profile picture file input */}
//             <div className="modal-field">
//               <label className="input-label">Attach File</label>
//               <label htmlFor="profileFile" className="file-upload-btn" style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #dfe5e5', borderRadius: '6px', background: '#f5f6f8', color: '#172b4d'}}>
//                 <FiUpload className="btn-icon" />
//                 {profileFile ? profileFile.name : 'Choose File'}
//               </label>
//               <input
//                 id="profileFile"
//                 type="file"
//                 name="profileFile"
//                 onChange={handleNewUserChange}
//                 accept="image/*"
//                 style={{ display: 'none' }}
//               />
//             </div>

//             <div className="modal-actions" style={{ gridColumn: "span 3", alignItems: 'center' }}>
//               <button className="btn-reset" onClick={handleReset}>Reset</button>
//               <button className="btn-save" onClick={handleSave}>Save</button>
//               <button className="modal-delete-btn" onClick={async () => {
//                 if (window.confirm('Delete this issue?')) {
//                   await deleteIssueAPI(selectedIssue.id);
//                   const refreshed = await listIssues(projectId);
//                   setIssues(refreshed);
//                   setSelectedIssue(null);
//                 }
//               }}>🗑</button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* Inline CSS styles */}
//       <style>{`
//         /* Include the full CSS from the previous answer - Kanban board styling, tooltip, modals, buttons */
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           background-color: #f5f6f8;
//            background-color: #f5f6f8;
//           margin: 0;
//           padding: 16px;
//         }
//         .board-wrap {
//           max-width: 100%;
//           overflow-x: auto;
//         }
// body {
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//   background-color: #f5f6f8;
//   margin: 0;
//   padding: 16px;
// }
// .board-wrap {
//   max-width: 100%;
//   overflow-x: auto;
// }
// .swimlane {
//   background: white;
//   border-radius: 8px;
//   margin-bottom: 16px;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//   overflow: hidden;
// }
// .swimlane-header {
//   display: flex;
//   align-items: center;
//   padding: 12px 16px;
//   background: #D0F0F4;
//   border-bottom: 1px solid #dfe5e5;
//   font-weight: 600;
//   font-size: 14px;
//   color: #172b4d;
// }
// .swimlane-toggle, .swimlane-icon {
//   color: #5e6c84;
//   margin-right: 8px;
//   cursor: pointer;
// }
// .swimlane-toggle {
//   border: none;
//   background: transparent;
//   font-size: 14px;
// }
// .swimlane-icon {
//   font-size: 18px;
// }
// .swimlane-title-input {
//   border: 1px solid #dfe5e5;
//   border-radius: 4px;
//   padding: 4px 8px;
//   font-size: 14px;
//   font-weight: 600;
//   background: white;
//   margin-right: 8px;
//   min-width: 150px;
//   color: #172b4d;
// }
// .swimlane-title-input:focus {
//   outline: none;
//   border-color: #1976d2;
// }
// .swimlane-title-input::placeholder {
//   color: #a2adba;
// }
// .swimlane-title-input:hover {
//   border-color: #a2adba;
// }
// .swimlane-title-input:disabled {
//   background: #f5f6f8;
//   color: #a2adba;
// }
// .swimlane-count {
//   color: #5e6c84;
//   font-size: 12px;
//   font-weight: normal;
//   user-select: none;
// }
// .kanban-row {
//   display: flex;
//   padding: 16px;
//   gap: 12px;
//   overflow-x: auto;
// }
// .kanban-column {
//   flex: 0 0 260px;
//   // background: #f5f6f8;
//   background: #D0F0F4;
//   border-radius: 6px;
//   padding: 12px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   border: 1px solid #dfe5e5;
//   user-select: none;
// }
// .col-header {
//   display: flex;
//   align-items: center;
//   margin-bottom: 4px;
//   gap: 6px;
// }
// .col-title {
//   font-weight: 600;
//   font-size: 12px;
//   color: #5e6c84;
//   text-transform: uppercase;
//   letter-spacing: 0.5px;
//   flex-grow: 1;
//   user-select: none;
// }
// .col-title:empty {
//   height: 20px;
// }
// .col-count {
 
//    background: #DOFOF4;
//   color: #5e6c84;
//   border-radius: 12px;
//   padding: 2px 8px;
//   font-size: 11px;
//   font-weight: 600;
//   user-select: none;
//   min-width: 20px;
//   text-align: center;
// }
// .col-icons {
//   display: flex;
//   gap: 6px;
// }
// .col-icon {
//   cursor: pointer;
//   color: #5e6c84;
//   font-size: 18px;
//   background: none;
//   border: none;
//   padding: 0;
//   user-select: none;
// }
// .col-icon:hover {
//   color: #1976d2;
// }
// .create-card {
//   background: white;
//   padding: 10px;
//   border-radius: 6px;
//   box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// }
// .create-card textarea {
//   resize: vertical;
//   min-height: 50px;
//   font-size: 14px;
//   padding: 8px;
//   border-radius: 5px;
//   border: 1px solid #dfe5e5;
//   font-family: inherit;
// }
// .create-card textarea:focus {
//   outline: none;
//   border-color: #1976d2;
// }
// .create-card .create-actions {
//   display: flex;
//   align-items: center;
//   gap: 12px;
// }
// .create-card .create-actions select {
//   flex-grow: 1;
//   padding: 8px;
//   border: 1px solid #dfe5e5;
//   border-radius: 5px;
//   font-size: 14px;
// }
// .create-card button {
//   padding: 8px 12px;
//   font-size: 14px;
//   cursor: pointer;
//   border-radius: 5px;
//   border: 1px solid #dfe5e5;
//   background: #f5f6f8;
//   user-select: none;
//   transition: background-color 0.2s;
// }
// .create-card button:hover {
//   background: #e1e7f0;
// }
// .card-item {
//   background: white;
//   border-radius: 8px;
//   padding: 12px;
//   box-shadow: 0 0 2px rgba(0,0,0,0.1);
//   cursor: pointer;
//   user-select: none;
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   border: 1px solid #dfe5e5;
//   transition: box-shadow 0.2s ease, border-color 0.2s ease;
// }
// .card-item:hover {
//   box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
//   border-color: #a2adba;
// }
// .card-item .card-top {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 12px;
//   font-weight: 600;
//   color: #5e6c84;
//   gap: 10px;
// }
// .card-item .card-top .card-id {
//   font-family: monospace;
//   color: #a2adba;
//   user-select: text;
// }
// .card-item .card-tags .tag {
//   border-radius: 6px;
//   padding: 3px 7px;
//   font-size: 11px;
//   font-weight: 600;
//   text-transform: uppercase;
//   white-space: nowrap;
//   user-select: none;
//   margin-right: 6px;
// }
// .tag-task {
//   background: #e1efff;
//   color: #1976d2;
// }
// .tag-bug {
//   background: #ffebec;
//   color: #d62127;
// }
// .tag-subtask {
//   background: #f5e6ff;
//   color: #772da0;
// }
// .card-item .card-title {
//   font-weight: 600;
//   font-size: 14px;
//   color: #2b3a59;
// }
// .card-item .card-meta {
//   display: flex;
//   gap: 10px;
//   font-size: 12px;
//   color: #6b7c93;
//   align-items: center;
//   user-select: none;
// }
// .card-item .card-meta span {
//   background: #f5f7fa;
//   color: #6b7c93;
//   padding: 3px 8px;
//   border-radius: 12px;
// }
// .card-item .card-meta .card-priority.low {
//   background: #d4edda;
//   color: #155724;
// }
// .card-item .card-meta .card-priority.medium {
//   background: #fff3cd;
//   color: #856404;
// }
// .card-item .card-meta .card-priority.high {
//   background: #f8d7da;
//   color: #721c24;
// }
// .card-item .card-meta .card-assignee {
//   position: relative;
//   cursor: default;
//   padding-left: 18px;
// }
// .card-item .card-meta .card-assignee:hover .tooltip {
//   display: block;
// }
// .card-item .card-meta .tooltip {
//   position: absolute;
//   top: -30px;
//   left: 50%;
//   transform: translateX(-50%);
//   background: #222;
//   color: white;
//   border-radius: 4px;
//   padding: 4px 8px;
//   font-size: 11px;
//   white-space: nowrap;
//   z-index: 10;
//   display: none;
//   user-select: none;
// }
// .modal-overlay {
//   position: fixed;
//   top: 0; left: 0; right: 0; bottom: 0;
//   background: rgba(0,0,0,0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// }
// .modal {
//   background: white;
//   border-radius: 8px;
//   padding: 24px;
//   width: 700px;
//   max-height: 80vh;
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   gap: 16px;
//   overflow-y: auto;
//   position: relative;
// }
// .modal-header {
//   grid-column: 1 / -1;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-weight: 700;
//   font-size: 20px;
//   color: #2b3a59;
// }
// .modal-header button {
//   background: none;
//   border: none;
//   font-size: 22px;
//   cursor: pointer;
//   color: #a2adba;
// }
// .modal-header button:hover {
//   color: #485fc7;
// }
// .modal-field {
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
// }
// .modal-field label {
//   font-size: 12px;
//   font-weight: 600;
//   color: #6b7c93;
//   user-select: none;
// }
// .modal-field input, .modal-field textarea, .modal-field select {
//   padding: 8px 10px;
//   border-radius: 6px;
//   border: 1px solid #dfe5e5;
//   font-size: 14px;
//   color: #2b3a59;
//   font-family: inherit;
// }
// .modal-field input:focus, .modal-field textarea:focus, .modal-field select:focus {
//   outline: none;
//   border-color: #485fc7;
//   background: #f8fcff;
// }
// .modal-actions {
//   grid-column: 1 / -1;
//   display: flex;
//   justify-content: flex-end;
//   gap: 12px;
//   align-items: center;
//   margin-top: 12px;
// }
// button.btn-reset {
//   background: #5e6c84;
//   color: white;
//   font-weight: 600;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 6px;
//   cursor: pointer;
// }
// button.btn-reset:hover {
//   background: #485fc7;
// }
// button.btn-save {
//   background: #485fc7;
//   color: white;
//   font-weight: 600;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 6px;
//   cursor: pointer;
// }
// button.btn-save:hover {
//   background: #374cac;
// }
// button.btn-delete {
//   background: #d94343;
//   color: white;
//   font-weight: 600;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 6px;
//   cursor: pointer;
// }
// button.btn-delete:hover {
//   background: #b83232;
// }
// input[disabled] {
//   background: #efeff1;
//   cursor: not-allowed;
//   color: #b3b3b3;
// }
// .epic-modal-overlay {
//   position: fixed;
//   top: 0; left: 0; right: 0; bottom: 0;
//   background: rgba(0,0,0,0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// }
// .epic-modal {
//   background: white;
//   border-radius: 8px;
//   width: 350px;
//   padding: 20px;
//   box-shadow: 0 0 10px rgba(0,0,0,0.2);
//   position: relative;
// }
// .epic-modal-content h3 {
//   margin: 0 0 20px 0;
//   font-weight: 700;
//   font-size: 20px;
//   color: #2b3a59;
//   user-select: none;
// }
// .epic-modal-content p.delete-warning {
//   background: #ffe6e6;
//   padding: 10px;
//   color: #d94343;
//   font-size: 14px;
//   margin-bottom: 15px;
//   border-radius: 6px;
// }
// .epic-modal-input, .epic-modal-select {
//   width: 100%;
//   padding: 10px;
//   font-size: 14px;
//   margin-bottom: 20px;
//   border-radius: 6px;
//   border: 1px solid #dfe5e5;
//   box-sizing: border-box;
//   font-family: inherit;
// }
// .epic-modal-input:focus, .epic-modal-select:focus {
//   outline: none;
//   border-color: #485fc7;
// }
// .epic-modal-actions {
//   display: flex;
//   justify-content: space-between;
//   gap: 15px;
// }
// button.create-epic-btn, button.delete-epic-btn {
//   background: #485fc7;
//   color: white;
//   font-weight: 600;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 15px;
//   user-select: none;
// }
// button.create-epic-btn:hover, button.delete-epic-btn:hover {
//   background: #374cac;
// }
// button.delete-epic-btn {
//   background: #d94343;
// }
// button.delete-epic-btn:hover {
//   background: #b83232;
// }

//       `}</style>

//     </div>
//   );
// }

// const btnStyle = {
//   cancel: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#5e6c84',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   },
//   create: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#1976d2',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   },
//   delete: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#d32f2f',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   }
// };













// updated code 


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiUpload, FiFilter, FiRefreshCw } from 'react-icons/fi'; // Import for upload, filter, and refresh icons


const mockIssues = [
  { id: 'i1', epic: 'p1', epicName: 'Frontend', status: 'todo', type: 'Task', title: 'Setup repo', assignee: 'John Doe', storyPoints: 3, labels: [], dueDate: '2025-09-30', reporter: 'admin', priority: 'High', startDate: '2025-09-15', description: '', subtasks: '', comments: '' },
  { id: 'i3', epic: 'p2', epicName: 'Middleware', status: 'todo', type: 'Subtask', title: 'API integration', assignee: 'Jane Smith', storyPoints: 2, labels: [], dueDate: '', reporter: 'lead-dev', priority: 'Low', startDate: '2025-09-18', description: '', subtasks: '', comments: '' }
];

const defaultStatuses = ['backlog', 'todo', 'analysis', 'inprogress', 'blocked', 'code review', 'qa', 'milestone', 'done'];
const mockEpics = [{ id: 'p1', name: 'Frontend' }, { id: 'p2', name: 'Middleware' }];

const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 200));
const listIssues = async (projectId) => {
  try {
    // Fetch from admin_tickets table (shows ALL projects)
    const url = projectId 
      ? `http://localhost:8000/admin/tickets?project_id=${projectId}`
      : 'http://localhost:8000/admin/tickets';
     
    console.log('Admin: Fetching tickets from:', url);
    const response = await fetch(url, {
      cache: 'no-store',  // Disable cache to always get fresh data
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    if (response.ok) {
      const adminTickets = await response.json();
      console.log('Admin: Fetched admin tickets (fresh from DB):', adminTickets.length);
      console.log('Admin: Fetched admin tickets:', adminTickets.length, adminTickets);
      
      const mappedTickets = adminTickets.map(ticket => {
        // Parse epic information - prioritize epic_id from database field
        let epicId = ticket.epic_id;
        let epicName = '';
        
        // Also parse from description as fallback
        if (ticket.description) {
          // Look for [EPIC:ID:Name] pattern in description
          const epicMatch = ticket.description.match(/\[EPIC:([^:]+):([^\]]+)\]/);
          if (epicMatch) {
            const rawEpicId = epicMatch[1];
            epicName = epicMatch[2];
            
            // If epic_id not set in database, use the one from description
            if (!epicId) {
              // Convert epic ID to numeric format
              if (rawEpicId.startsWith('p')) {
                epicId = parseInt(rawEpicId.substring(1)); // Remove 'p' prefix and convert to number
              } else {
                epicId = parseInt(rawEpicId);
              }
            }
          }
        }
        
        // Ensure epicId is a number
        if (epicId && typeof epicId === 'string') {
          epicId = parseInt(epicId);
        }
        
        // Map backend status to frontend Kanban status
        let frontendStatus = ticket.status.toLowerCase().replace(/\s+/g, '');
        if (frontendStatus === 'open') {
          frontendStatus = 'backlog'; // Map "Open" to "backlog" column
        } else if (frontendStatus === 'codereview') {
          frontendStatus = 'code review';
        }
        
        const mappedTicket = {
          id: `i${ticket.ticket_id}`,
          epic: epicId ? `p${epicId}` : null,
          epicName: epicName || 'Unknown Epic',
          status: frontendStatus,
          type: 'Task',
          title: ticket.title,
          description: ticket.description || '',
          priority: ticket.priority,
          assignee: ticket.assignee || 'Unassigned',  // ✅ Map from assignee field, not user_name
          projectTitle: ticket.project_title,
          userName: ticket.user_name,
          storyPoints: 0,
          labels: [],
          dueDate: ticket.due_date || '',       // Map backend due_date to frontend dueDate
          reporter: ticket.reporter || '',      // ✅ Empty string for old tickets (will be handled in UI)
          startDate: ticket.start_date || '',   // Map backend start_date to frontend startDate
          subtasks: [],
          comments: ''
        };
        
        // Log dates for debugging
        if (ticket.start_date || ticket.due_date) {
          console.log(`Admin: Ticket ${ticket.ticket_id} dates - Start: ${ticket.start_date}, Due: ${ticket.due_date}`);
        }
        
        return mappedTicket;
      });
      
      console.log('Admin: Total mapped tickets:', mappedTickets.length);
      return mappedTickets;
    } else {
      console.error('Admin: Failed to fetch tickets, status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching admin tickets:', error);
  }
  // Fallback to empty array instead of mock
  console.log('Admin: Returning empty array (fetch failed)');
  return [];
};

const listEpics = async (projectId = null) => { 
  try {
    // Fetch from admin_epics table (shows ALL projects)
    const url = projectId 
      ? `http://localhost:8000/admin/epics?project_id=${projectId}`
      : 'http://localhost:8000/admin/epics';
    
    console.log('Admin: Fetching epics from:', url);
    const response = await fetch(url);
    if (response.ok) {
      const adminEpics = await response.json();
      console.log('Admin: Fetched admin epics:', adminEpics.length, adminEpics);
      
      const mappedEpics = adminEpics.map(epic => ({
        id: `p${epic.epic_id}`,
        name: epic.name,
        projectId: epic.project_id,
        projectTitle: epic.project_title,
        userName: epic.user_name
      }));
      
      console.log('Admin: Mapped epics:', mappedEpics);
      return mappedEpics;
    } else {
      console.error('Admin: Failed to fetch epics, status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching admin epics:', error);
  }
  // Fallback to mock
  await simulateApiDelay(); 
  return mockEpics; 
};
const createEpicAPI = async (epicName, projectId, projectTitle, userName) => {
  try {
    // Create in original epics table first
    const url = new URL('http://localhost:8000/epics');
    if (userName) {
      url.searchParams.append('user_name', userName);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: epicName, 
        project_id: projectId 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create epic');
    }
    
    const createdEpic = await response.json();
    console.log('Epic created in both tables:', createdEpic);
    
    return {
      id: `p${createdEpic.id}`,
      name: createdEpic.name,
      projectId: projectId,
      projectTitle: projectTitle,
      userName: userName
    };
  } catch (error) {
    console.error('Error creating epic:', error);
    throw error;
  }
};
const deleteEpicAPI = async (epicId) => {
  try {
    // Extract numeric ID from 'p12' format
    const numericEpicId = epicId.startsWith('p') ? epicId.substring(1) : epicId;
    
    // Delete from admin_epics first
    const adminEpicsResponse = await fetch(`http://localhost:8000/admin/epics?project_id=`);
    if (adminEpicsResponse.ok) {
      const adminEpics = await adminEpicsResponse.json();
      const adminEpic = adminEpics.find(e => e.epic_id == numericEpicId);
      if (adminEpic) {
        await fetch(`http://localhost:8000/admin/epics/${adminEpic.admin_epic_id}`, {
          method: 'DELETE'
        });
      }
    }
    
    // Delete from original epics table
    await fetch(`http://localhost:8000/epics/${numericEpicId}`, {
      method: 'DELETE'
    });
    
    console.log('Epic deleted from both tables:', epicId);
  } catch (error) {
    console.error('Error deleting epic:', error);
    throw error;
  }
};
const moveIssue = async (issueId, status) => {
  try {
    // Extract numeric ID from 'i26' format
    const numericTicketId = issueId.startsWith('i') ? issueId.substring(1) : issueId;
    
    // Map frontend status to backend status
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
      backendStatus = 'Code Review';
    } else if (status === 'qa') {
      backendStatus = 'QA';
    } else if (status === 'done') {
      backendStatus = 'Done';
    } else {
      // Capitalize first letter for other statuses
      backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    console.log(`Admin: Moving ticket ${issueId} from frontend status '${status}' to backend status '${backendStatus}'`);
    
    // Update original tickets table
    const response = await fetch(`http://localhost:8000/tickets/${numericTicketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: backendStatus })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update ticket status');
    }
    
    console.log('Ticket status updated in both tables:', issueId, backendStatus);
  } catch (error) {
    console.error('Error moving issue:', error);
    throw error;
  }
};
const createIssueAPI = async (issue, projectId, userName) => {
  try {
    // Extract numeric epic ID from 'p12' format
    const epicId = issue.epic.startsWith('p') ? issue.epic.substring(1) : issue.epic;
    
    // Create description with epic information
    const epicInfo = `[EPIC:${epicId}:${issue.epicName}]`;
    const description = issue.description ? `${epicInfo} ${issue.description}` : epicInfo;
    
    // Get or create user ID for the logged-in admin/user
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
              name: userEmail.split('@')[0]
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
    
    // Create in original tickets table (which auto-creates in admin_tickets via backend)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        title: issue.title,
        description: description,
        status: issue.status || 'Open',
        priority: issue.priority || 'Medium',
        assignee: issue.assignee || null,      // Include assignee
        reporter: issue.reporter || null,      // Include reporter (person who created ticket)
        start_date: issue.startDate || null,  // Include start date
        due_date: issue.dueDate || null        // Include due date
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ticket creation failed:', errorData);
      throw new Error(`Failed to create ticket: ${errorData}`);
    }
    
    const createdTicket = await response.json();
    console.log('Ticket created in both tables:', createdTicket);
    
    return {
      id: `i${createdTicket.id}`,
      ...issue,
      ticketId: createdTicket.id
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};
const deleteIssueAPI = async (issueId) => {
  try {
    // Extract numeric ID from 'i26' format
    const numericTicketId = issueId.startsWith('i') ? issueId.substring(1) : issueId;
    
    // Delete from admin_tickets first
    const adminTicketsResponse = await fetch(`http://localhost:8000/admin/tickets`);
    if (adminTicketsResponse.ok) {
      const adminTickets = await adminTicketsResponse.json();
      const adminTicket = adminTickets.find(t => t.ticket_id == numericTicketId);
      if (adminTicket) {
        await fetch(`http://localhost:8000/admin/tickets/${adminTicket.admin_ticket_id}`, {
          method: 'DELETE'
        });
      }
    }
    
    // Delete from original tickets table
    await fetch(`http://localhost:8000/tickets/${numericTicketId}`, {
      method: 'DELETE'
    });
    
    console.log('Ticket deleted from both tables:', issueId);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};
const updateIssueAPI = async (updatedIssue) => {
  try {
    // Extract numeric ID from 'i26' format
    const numericTicketId = updatedIssue.id.startsWith('i') ? updatedIssue.id.substring(1) : updatedIssue.id;
    
    // Update original tickets table (which updates admin_tickets via backend)
    const response = await fetch(`http://localhost:8000/tickets/${numericTicketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedIssue.title,
        description: updatedIssue.description,
        status: updatedIssue.status,
        priority: updatedIssue.priority,
        assignee: updatedIssue.assignee || null,      // Include assignee
        reporter: updatedIssue.reporter || null,      // Include reporter
        start_date: updatedIssue.startDate || null,  // Map camelCase to snake_case
        due_date: updatedIssue.dueDate || null        // Map camelCase to snake_case
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }
    
    console.log('Ticket updated in both tables (with dates):', updatedIssue.id);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

const getSwimlanes = (issues, epics) => {
  console.log('Admin: getSwimlanes - epics:', epics.length, epics.map(e => ({ id: e.id, name: e.name })));
  console.log('Admin: getSwimlanes - issues:', issues.length, issues.map(i => ({ id: i.id, epic: i.epic, title: i.title })));
  
  return epics.map(epic => {
    const epicIssues = issues.filter(i => {
      const match = (i.epic || i.projectId) === epic.id;
      if (!match && i.epic) {
        console.log(`Admin: Issue ${i.id} epic '${i.epic}' does not match epic '${epic.id}'`);
      }
      return match;
    });
    console.log(`Admin: Epic '${epic.id}' (${epic.name}) has ${epicIssues.length} issues`);
    return { id: epic.id, title: epic.name, issues: epicIssues };
  });
};

export default function KanbanBoard() {
  const { projectId } = useParams();
  const [profileFile, setProfileFile] = useState(null); // New state for file input
  const [issues, setIssues] = useState([]);
  const [epics, setEpics] = useState([]);
  const [projects, setProjects] = useState([]); // NEW: All projects
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(null); // Project filter dropdown
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
  const [selectedUserForEpic, setSelectedUserForEpic] = useState('');
  const [columnsByLane, setColumnsByLane] = useState({});
  const [columnModal, setColumnModal] = useState(null);
  const [columnInput, setColumnInput] = useState('');
  const [hoveredAssigneeId, setHoveredAssigneeId] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const handleNewUserChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
      // Also update editIssue if you want to keep the file info within issue object (optional)
      handleUpdateField('profileFile', e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // ...existing fetch logic unchanged
    };
    fetchData();
  }, [projectId]);

  // Extracted fetchData function so it can be called from refresh button
  const loadAllData = async () => {
    try {
      // Fetch ALL projects (admin sees everything)
      const projectsResponse = await fetch('http://localhost:8000/projects');
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);
      
      // Create a Set of valid project IDs for filtering
      const validProjectIds = new Set(projectsData.map(p => p.id));
      
      // Fetch all epics and tickets (admin sees all projects)
      const [issuesData, epicsData] = await Promise.all([
        listIssues(null), // null = fetch ALL tickets from all projects
        listEpics(null)   // null = fetch ALL epics from all projects
      ]);
      
      // Filter out orphaned epics (epics whose projects no longer exist)
      const filteredEpics = epicsData.filter(epic => {
        if (!epic.projectId) {
          console.warn('Admin: Epic without projectId found:', epic);
          return false; // Remove epics without project_id
        }
        const isValid = validProjectIds.has(epic.projectId);
        if (!isValid) {
          console.warn('Admin: Removing orphaned epic:', epic.id, epic.name, 'Project ID:', epic.projectId);
        }
        return isValid;
      });
      
      // Create a Set of valid epic IDs for filtering tickets
      const validEpicIds = new Set(filteredEpics.map(e => e.id));
      
      // Filter out orphaned tickets (tickets whose epics no longer exist)
      const filteredIssues = issuesData.filter(issue => {
        if (!issue.epic && !issue.projectId) {
          console.warn('Admin: Ticket without epic/projectId found:', issue);
          return false;
        }
        const epicId = issue.epic || issue.projectId;
        const isValid = validEpicIds.has(epicId);
        if (!isValid) {
          console.warn('Admin: Removing orphaned ticket:', issue.id, issue.title, 'Epic ID:', epicId);
        }
        return isValid;
      });
      
      console.log('Admin portal loaded:', {
        projects: projectsData.length,
        epics: filteredEpics.length,
        tickets: filteredIssues.length,
        orphanedEpics: epicsData.length - filteredEpics.length,
        orphanedTickets: issuesData.length - filteredIssues.length
      });
      
      setIssues(filteredIssues);
      setEpics(filteredEpics);
      
      console.log('Admin: About to call getSwimlanes with:', { issues: filteredIssues.length, epics: filteredEpics.length });
      const lanes = getSwimlanes(filteredIssues, filteredEpics);
      console.log('Admin: getSwimlanes returned:', lanes.length, 'lanes');
      
      const initialOpen = {}, initialTitles = {}, initialCols = {};
      lanes.forEach(lane => {
        initialOpen[lane.id] = true;
        initialTitles[lane.id] = lane.title;
        initialCols[lane.id] = defaultStatuses.slice();
        console.log(`Admin: Lane '${lane.id}' (${lane.title}) has ${lane.issues.length} issues`);
      });
      setOpenSwimlanes(initialOpen);
      setCustomTitles(initialTitles);
      setColumnsByLane(initialCols);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadAllData();
  }, [projectId]);

  const openAddColumnModal = (e, laneId, colIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    setColumnModal({ laneId, colIndex, type: 'add' });
    setColumnInput('');
  };
  const openEditColumnModal = (e, laneId, colIndex, status) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    setColumnModal({ laneId, colIndex, type: 'menu' });
    setColumnInput(status);
  };
  const handleAddColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert('Column name is required');
    setColumnsByLane(prev => {
      const cols = [...prev[columnModal.laneId]];
      if (cols.includes(name.toLowerCase())) alert('Column name already exists');
      else cols.splice(columnModal.colIndex + 1, 0, name.toLowerCase());
      return { ...prev, [columnModal.laneId]: cols };
    });
    setColumnModal(null);
    setColumnInput('');
  };
  const handleEditColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert('Column name is required');
    const { laneId, colIndex } = columnModal;
    const oldCol = columnsByLane[laneId][colIndex];
    if (columnsByLane[laneId].includes(name.toLowerCase()) && name.toLowerCase() !== oldCol) {
      alert('Column name already exists');
      return;
    }
    setColumnsByLane(prev => {
      const cols = [...prev[laneId]];
      cols[colIndex] = name.toLowerCase();
      return { ...prev, [laneId]: cols };
    });
    const updatedIssues = issues.map(issue =>
      (issue.epic || issue.projectId) === laneId && issue.status === oldCol ? { ...issue, status: name.toLowerCase() } : issue
    );
    setIssues(updatedIssues);
    setColumnModal(null);
    setColumnInput('');
  };
  const handleDeleteColumn = () => {
    const { laneId, colIndex } = columnModal;
    const removedCol = columnsByLane[laneId][colIndex];
    setColumnsByLane(prev => {
      const cols = [...prev[laneId]];
      cols.splice(colIndex, 1);
      return { ...prev, [laneId]: cols };
    });
    const updatedIssues = issues.map(issue =>
      (issue.epic || issue.projectId) === laneId && issue.status === removedCol ? { ...issue, status: 'backlog' } : issue
    );
    setIssues(updatedIssues);
    setColumnModal(null);
    setColumnInput('');
  };
  const toggleSwimlane = (id) => setOpenSwimlanes(prev => ({ ...prev, [id]: !prev[id] }));
  const byStatus = (collection, status) => collection.filter(i => i.status === status);

  const onDragStart = (e, issueId) => e.dataTransfer.setData('text/plain', issueId);
  const onDrop = async (e, targetStatus, swimlaneId) => {
    e.preventDefault();
    try {
      const issueId = e.dataTransfer.getData('text/plain');
      const issue = issues.find(i => i.id === issueId);
      const srcLaneId = issue.epic || issue.projectId;
      if (srcLaneId === swimlaneId && issue.status !== targetStatus) {
        await moveIssue(issueId, targetStatus);
        const refreshed = await listIssues(projectId);
        setIssues(refreshed);
      }
    } catch (err) { console.error(err); }
  };
  const onDragOver = e => e.preventDefault();

  const handleCreateClick = laneId => { setCreateLaneId(laneId); setNewTaskText(''); setNewTaskType('Task'); };
  const handleCreateSubmit = async lane => {
    if (!newTaskText.trim()) { alert('Task title is required'); return; }
    
    // Get project and user info from the epic
    const epic = epics.find(e => e.id === lane.id);
    const projectIdForTicket = epic?.projectId || null;
    const userNameForTicket = epic?.userName || '';
    
    // Get current user email as reporter (person creating the ticket)
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
      subtasks: '',
      comments: ''
    };
    try {
      await createIssueAPI(newIssue, projectIdForTicket, userNameForTicket);
      const refreshed = await listIssues(projectId);
      setIssues(refreshed);
      setCreateLaneId(null);
    } catch (err) { 
      console.error(err);
      alert('Failed to create ticket: ' + err.message);
    }
  };

  const handleOpenModal = (issue) => { 
    // Don't auto-change reporter when just opening - preserve existing value
    // Only set reporter if it's truly empty (old tickets)
    setSelectedIssue(issue); 
    setEditIssue({ ...issue }); 
  };
  
  const handleUpdateField = (field, value) => { 
    setEditIssue(prev => {
      const updated = { ...prev, [field]: value };
      // If assignee is being changed AND it's an actual change, update reporter to current user
      if (field === 'assignee' && value && value !== prev.assignee && prev.assignee !== '') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        updated.reporter = currentUser.email || prev.reporter;
        console.log(`Assignee changed from "${prev.assignee}" to "${value}", reporter set to: ${updated.reporter}`);
      }
      return updated;
    });
  };
  
  const handleSave = async () => { 
    // For old tickets without reporter, set it to current user when saving
    if (!editIssue.reporter || editIssue.reporter === '' || editIssue.reporter === '(Not set)') {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const reporterEmail = currentUser.email || 'system';
      editIssue.reporter = reporterEmail;
      console.log('Auto-setting reporter for old ticket:', reporterEmail);
    }
    await updateIssueAPI(editIssue); 
    const refreshed = await listIssues(projectId); 
    setIssues(refreshed); 
    setSelectedIssue(null); 
    setEditIssue(null); 
  };
  
  const handleReset = () => { setEditIssue({ ...selectedIssue }); };

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

  // Create Epic Modal Handlers
  const handleCreateEpic = async () => {
    if (!newEpicName.trim()) {
      alert('Epic name is required');
      return;
    }
    
    // Auto-use filtered project if available
    const projectForEpic = selectedProjectForEpic || (selectedProjectFilter ? projects.find(p => p.id === selectedProjectFilter) : null);
    
    if (!projectForEpic) {
      alert('Please select a project');
      return;
    }
    if (!selectedUserForEpic.trim()) {
      alert('Please enter user email');
      return;
    }
    try {
      await createEpicAPI(
        newEpicName, 
        projectForEpic.id, 
        projectForEpic.name, 
        selectedUserForEpic
      );
      const updatedEpics = await listEpics();
      setEpics(updatedEpics);
      setNewEpicName('');
      setSelectedProjectForEpic(null);
      setSelectedUserForEpic('');
      setShowCreateEpic(false);
      const newEpic = updatedEpics[updatedEpics.length - 1];
      setOpenSwimlanes(prev => ({ ...prev, [newEpic.id]: true }));
      setCustomTitles(prev => ({ ...prev, [newEpic.id]: newEpic.name }));
      setColumnsByLane(prev => ({ ...prev, [newEpic.id]: defaultStatuses.slice() }));
    } catch (error) {
      console.error('Error creating epic:', error);
      alert('Failed to create epic: ' + error.message);
    }
  };

  // Delete Epic Modal Handler
  const handleDeleteEpic = async () => {
    if (!epicToDelete) {
      alert('Please select an epic to delete');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the epic "${epics.find(e => e.id === epicToDelete)?.name}"? This will also delete all issues in this epic.`)) {
      return;
    }
    try {
      await deleteEpicAPI(epicToDelete);
      const [refreshedIssues, refreshedEpics] = await Promise.all([
        listIssues(projectId),
        listEpics()
      ]);
      setIssues(refreshedIssues);
      setEpics(refreshedEpics);
      setEpicToDelete('');
      setShowDeleteEpic(false);
      setColumnsByLane(prev => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
      setOpenSwimlanes(prev => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
      setCustomTitles(prev => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
    } catch (error) {
      console.error('Error deleting epic:', error);
    }
  };

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
        <FiFilter style={{ color: '#6B778C', fontSize: '18px' }} />
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
              {project.name} (Key: {project.project_key})
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
        <button
          onClick={loadAllData}
          style={{
            padding: '6px 12px',
            background: '#10b981',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title="Refresh data from database"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#6B778C' }}>
          Showing {filteredEpics.length} epic{filteredEpics.length !== 1 ? 's' : ''} · {filteredIssues.length} ticket{filteredIssues.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Epic management buttons */}
      <div className="epic-management-section">
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
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Enter user email" 
                  value={selectedUserForEpic} 
                  onChange={(e) => setSelectedUserForEpic(e.target.value)} 
                  className="epic-modal-input" 
                  style={{ marginTop: '10px' }}
                />
                <div className="epic-modal-actions">
                  <button className="btn-cancel" onClick={() => { setShowCreateEpic(false); setNewEpicName(''); setSelectedProjectForEpic(null); setSelectedUserForEpic(''); }}>Cancel</button>
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
        // Find the epic to get project title and lead email
        const epic = epics.find(e => e.id === lane.id);
        const projectTitle = epic?.projectTitle || 'Unknown Project';
        
        // Get project lead email from project data (not from ticket creator)
        const project = projects.find(p => p.id === epic?.projectId);
        const leadEmail = project?.leads ? project.leads.split(',')[0].trim() : 'Unknown Lead';
        
        return (
          <section className="swimlane" key={lane.id}>
            {/* NEW: Display project name and lead email above the board */}
            <div style={{
              padding: '8px 16px',
              background: '#f0f9ff',
              borderLeft: '4px solid #3b82f6',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e40af'
            }}>
              📁 Project: {projectTitle} | 👤 Lead: {leadEmail}
            </div>
            <header className="swimlane-header">
              <button className="swimlane-toggle" onClick={() => toggleSwimlane(lane.id)}>{isOpen ? '▼' : '▶'}</button>
              <span className="swimlane-icon">⚡</span>
              <input className="swimlane-title-input" value={customTitles[lane.id] || ''} onChange={e => setCustomTitles(prev => ({ ...prev, [lane.id]: e.target.value }))} />
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
                          <div className="card-item" key={issue.id} draggable onDragStart={e => onDragStart(e, issue.id)} onClick={() => handleOpenModal(issue)}>
                            <div className="card-top">
                              <span className={`card-tag card-tag-${issue.type.toLowerCase()}`}>{issue.type}</span>
                              <span className="card-id">{issue.id}</span>
                            </div>
                            <div className="card-title">{issue.title}</div>
                            <div className="card-meta">
                              {issue.dueDate && <span className="card-due">📅 {issue.dueDate}</span>}
                              <span className={`card-priority ${issue.priority.toLowerCase()}`}>⚑ {issue.priority}</span>
                              {issue.assignee && issue.assignee !== 'Unassigned' && (
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

      {/* Column Add/Edit modal */}
      {columnModal && (columnModal.type === 'add' || columnModal.type === 'menu') && (
        <div className="epic-modal-overlay" onClick={() => setColumnModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="epic-modal" onClick={e => e.stopPropagation()} style={{
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            transform: 'translateX(-50%)',
            minWidth: 280,
            maxWidth: 320,
            padding: 20,
            borderRadius: 10,
            background: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            zIndex: 1100
          }}>
            {columnModal.type === 'add' ? (
              <>
                <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Add Column</h3>
                <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
                <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
                  <button className="btn-create" onClick={handleAddColumn} style={btnStyle.create}>Add</button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Edit/Delete Column</h3>
                <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
                <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button className="btn-save" onClick={handleEditColumn} style={btnStyle.create}>Rename</button>
                  <button className="btn-delete" onClick={handleDeleteColumn} style={btnStyle.delete}>Delete</button>
                  <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Issue modal */}
     {/* Issue modal */}
      {selectedIssue && editIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editIssue.epicName}</h2>
              <button className="modal-close-btn" onClick={() => setSelectedIssue(null)}>✖</button>
            </div>
            <div className="modal-field"><label>Title</label><input value={editIssue.title} onChange={e => handleUpdateField('title', e.target.value)} /></div>
            <div className="modal-field"><label>Description</label><textarea value={editIssue.description} onChange={e => handleUpdateField('description', e.target.value)} /></div>
            <div className="modal-field"><label>Subtasks</label><input value={editIssue.subtasks} onChange={e => handleUpdateField('subtasks', e.target.value)} /></div>
            <div className="modal-field"><label>Comments</label><textarea value={editIssue.comments} onChange={e => handleUpdateField('comments', e.target.value)} /></div>
            <div className="modal-field">
              <label>Status</label>
              <select value={editIssue.status} onChange={e => handleUpdateField('status', e.target.value)}>
                {(columnsByLane[editIssue.epic] || defaultStatuses).map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Assignee</label>
              <select value={editIssue.assignee || ''} onChange={e => handleUpdateField('assignee', e.target.value)}>
                <option value="">Select assignee...</option>
                {getAssignableUsers(editIssue).map(userEmail => (
                  <option key={userEmail} value={userEmail}>{userEmail}</option>
                ))}
              </select>
            </div>
            <div className="modal-field"><label>Reporter</label><input disabled value={editIssue.reporter} /></div>
            <div className="modal-field">
              <label>Priority</label>
              <select value={editIssue.priority} onChange={e => handleUpdateField('priority', e.target.value)}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="modal-field"><label>Due Date</label><input type="date" value={editIssue.dueDate} onChange={e => handleUpdateField('dueDate', e.target.value)} /></div>
            <div className="modal-field"><label>Start Date</label><input type="date" value={editIssue.startDate} onChange={e => handleUpdateField('startDate', e.target.value)} /></div>

            {/* Added profile picture file input */}


            <div className="modal-actions" style={{ gridColumn: "span 3", alignItems: 'center' }}>
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="btn-save" onClick={handleSave}>Save</button>
              <button className="modal-delete-btn" onClick={async () => {
                if (window.confirm('Delete this issue?')) {
                  await deleteIssueAPI(selectedIssue.id);
                  const refreshed = await listIssues(projectId);
                  setIssues(refreshed);
                  setSelectedIssue(null);
                }
              }}>🗑</button>
            </div>
          </div>
        </div>
      )}


      {/* Inline CSS styles */}
      <style>{`
        /* Include the full CSS from the previous answer - Kanban board styling, tooltip, modals, buttons */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f6f8;
           background-color: #f5f6f8;
          margin: 0;
          padding: 16px;
        }
        .board-wrap {
          max-width: 100%;
          overflow-x: auto;
        }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f6f8;
  margin: 0;
  padding: 16px;
}
.board-wrap {
  max-width: 100%;
  overflow-x: auto;
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
.swimlane-toggle, .swimlane-icon {
  color: #5e6c84;
  margin-right: 8px;
  cursor: pointer;
}
.swimlane-toggle {
  border: none;
  background: transparent;
  font-size: 14px;
}
.swimlane-icon {
  font-size: 18px;
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
.swimlane-title-input::placeholder {
  color: #a2adba;
}
.swimlane-title-input:hover {
  border-color: #a2adba;
}
.swimlane-title-input:disabled {
  background: #f5f6f8;
  color: #a2adba;
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
  // background: #f5f6f8;
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
.col-title:empty {
  height: 20px;
}
.col-count {
 
   background: #DOFOF4;
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
.card-item .card-tags .tag {
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  margin-right: 6px;
}
.tag-task {
  background: #e1efff;
  color: #1976d2;
}
.tag-bug {
  background: #ffebec;
  color: #d62127;
}
.tag-subtask {
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
.card-item .card-meta .card-assignee {
  position: relative;
  cursor: default;
  padding-left: 18px;
}
.card-item .card-meta .card-assignee:hover .tooltip {
  display: block;
}
.card-item .card-meta .tooltip {
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
  display: none;
  user-select: none;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 700px;
  max-height: 80vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  overflow-y: auto;
  position: relative;
}
.modal-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  color: #2b3a59;
}
.modal-header button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #a2adba;
}
.modal-header button:hover {
  color: #485fc7;
}
.modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modal-field label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7c93;
  user-select: none;
}
.modal-field input, .modal-field textarea, .modal-field select {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #dfe5e5;
  font-size: 14px;
  color: #2b3a59;
  font-family: inherit;
}
.modal-field input:focus, .modal-field textarea:focus, .modal-field select:focus {
  outline: none;
  border-color: #485fc7;
  background: #f8fcff;
}
.modal-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
}
button.btn-reset {
  background: #5e6c84;
  color: white;
  font-weight: 600;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
button.btn-reset:hover {
  background: #485fc7;
}
button.btn-save {
  background: #485fc7;
  color: white;
  font-weight: 600;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
button.btn-save:hover {
  background: #374cac;
}
button.btn-delete {
  background: #d94343;
  color: white;
  font-weight: 600;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
button.btn-delete:hover {
  background: #b83232;
}
input[disabled] {
  background: #efeff1;
  cursor: not-allowed;
  color: #b3b3b3;
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

      `}</style>

    </div>
  );
}

const btnStyle = {
  cancel: {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#5e6c84',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  create: {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  delete: {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#d32f2f',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

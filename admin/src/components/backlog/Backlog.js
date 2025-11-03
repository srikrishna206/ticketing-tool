
// import React, { useEffect, useState } from 'react';
// import { listIssues, createIssue } from '../../services/mockApi';
// import { useParams } from 'react-router-dom';

// export default function Backlog() {
//   const { projectId } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('Story');
//   const [points, setPoints] = useState(3);

//   useEffect(()=>{ listIssues(projectId).then(setIssues); },[projectId]);

//   const add = async ()=>{
//     const data = { projectId: projectId||null, title, type, status:'todo', priority:'P3', assignee:'', storyPoints:points };
//     await createIssue(data);
//     setIssues(await listIssues(projectId));
//     setTitle(''); setPoints(3);
//   };

//   return (
//     <div className="card" role="region" aria-labelledby="backlog-title">
//       <h2 id="backlog-title">Backlog {projectId?`- ${projectId}`:''}</h2>
//       <div style={{display:'flex',gap:12}}>
//         <div style={{flex:1}}>
//           <div className="form-row"><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label></div>
//           <div className="form-row"><label>Type<select value={type} onChange={e=>setType(e.target.value)}><option>Story</option><option>Task</option><option>Bug</option></select></label></div>
//           <div className="form-row"><label>Story Points<input type="number" value={points} onChange={e=>setPoints(e.target.value)} /></label></div>
//           <button className="btn" onClick={add}>Add to Backlog</button>
//         </div>
//         <div style={{flex:2}}>
//           <h3>Backlog Items</h3>
//           <ul>{issues.map(i=>(<li key={i.id}>{i.title} — <em>{i.type}</em> — {i.storyPoints} pts</li>))}</ul>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react';
// import { listIssues, createIssue } from '../../services/mockApi';
// import { useParams } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// export default function JiraBoard() {
//   const { projectId } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [newIssue, setNewIssue] = useState({ title: '', type: 'Story', storyPoints: 3 });

//   // Fetch issues
//   useEffect(() => {
//     listIssues(projectId).then(setIssues);
//   }, [projectId]);

//   // Add new issue
//   const addIssue = async () => {
//     if (!newIssue.title) return alert('Title is required');
//     const data = {
//       projectId: projectId || null,
//       title: newIssue.title,
//       type: newIssue.type,
//       status: 'backlog',
//       priority: 'P3',
//       assignee: '',
//       storyPoints: newIssue.storyPoints,
//     };
//     await createIssue(data);
//     setIssues(await listIssues(projectId));
//     setNewIssue({ title: '', type: 'Story', storyPoints: 3 });
//   };

//   // Handle drag and drop
//   const onDragEnd = result => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const updatedIssues = Array.from(issues);
//     const [moved] = updatedIssues.splice(source.index, 1);
//     moved.status = destination.droppableId;
//     updatedIssues.splice(destination.index, 0, moved);
//     setIssues(updatedIssues);
//   };

//   // Delete issue
//   const deleteIssue = id => {
//     setIssues(prev => prev.filter(i => i.id !== id));
//   };

//   // Inline edit issue
//   const updateIssue = (id, field, value) => {
//     setIssues(prev =>
//       prev.map(i => (i.id === id ? { ...i, [field]: value } : i))
//     );
//   };

//   // Group issues by status
//   const columns = {
//     backlog: issues.filter(i => i.status === 'backlog'),
//     sprint: issues.filter(i => i.status === 'sprint'),
//     done: issues.filter(i => i.status === 'done'),
//   };

//   // Priority colors
//   const priorityColors = { P1: '#e74c3c', P2: '#f1c40f', P3: '#2ecc71' };

//   return (
//     <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Project Board {projectId ? `- ${projectId}` : ''}</h2>

//       {/* Add Issue Form */}
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
//         <input
//           placeholder="Title"
//           value={newIssue.title}
//           onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
//         />
//         <select value={newIssue.type} onChange={e => setNewIssue({ ...newIssue, type: e.target.value })}>
//           <option>Story</option>
//           <option>Task</option>
//           <option>Bug</option>
//         </select>
//         <input
//           type="number"
//           min={1}
//           value={newIssue.storyPoints}
//           onChange={e => setNewIssue({ ...newIssue, storyPoints: parseInt(e.target.value) })}
//           style={{ width: '60px' }}
//         />
//         <select value={newIssue.priority} onChange={e => setNewIssue({ ...newIssue, priority: e.target.value })}>
//           <option>P1</option>
//           <option>P2</option>
//           <option>P3</option>
//         </select>
//         <button onClick={addIssue}>Add</button>
//       </div>

//       {/* Board Columns */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
//           {Object.keys(columns).map(status => (
//             <Droppable droppableId={status} key={status}>
//               {provided => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   style={{
//                     flex: 1,
//                     minHeight: '300px',
//                     padding: '0.5rem',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     background: '#f4f5f7',
//                   }}
//                 >
//                   <h3 style={{ textTransform: 'capitalize' }}>{status}</h3>
//                   {columns[status].map((issue, index) => (
//                     <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
//                       {provided => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           style={{
//                             padding: '0.5rem',
//                             marginBottom: '0.5rem',
//                             border: '1px solid #ccc',
//                             borderRadius: '4px',
//                             background: '#fff',
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             ...provided.draggableProps.style,
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <input
//                               value={issue.title}
//                               onChange={e => updateIssue(issue.id, 'title', e.target.value)}
//                               style={{ fontWeight: 'bold', width: '100%', border: 'none', background: 'transparent' }}
//                             />
//                             <div style={{ fontSize: '12px', marginTop: '2px' }}>
//                               <select
//                                 value={issue.type}
//                                 onChange={e => updateIssue(issue.id, 'type', e.target.value)}
//                               >
//                                 <option>Story</option>
//                                 <option>Task</option>
//                                 <option>Bug</option>
//                               </select>
//                               <span
//                                 style={{
//                                   background: '#e1e1e1',
//                                   borderRadius: '12px',
//                                   padding: '2px 6px',
//                                   marginLeft: '6px',
//                                 }}
//                               >
//                                 {issue.storyPoints} pts
//                               </span>
//                               <span
//                                 style={{
//                                   background: priorityColors[issue.priority],
//                                   color: '#fff',
//                                   borderRadius: '12px',
//                                   padding: '2px 6px',
//                                   marginLeft: '6px',
//                                 }}
//                               >
//                                 {issue.priority}
//                               </span>
//                               <span
//                                 style={{
//                                   background: '#3498db',
//                                   color: '#fff',
//                                   borderRadius: '50%',
//                                   padding: '2px 6px',
//                                   marginLeft: '6px',
//                                   fontSize: '10px',
//                                 }}
//                               >
//                                 {issue.assignee ? issue.assignee[0].toUpperCase() : '?'}
//                               </span>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => deleteIssue(issue.id)}
//                             style={{
//                               marginLeft: '6px',
//                               border: 'none',
//                               background: 'transparent',
//                               color: '#e74c3c',
//                               cursor: 'pointer',
//                               fontWeight: 'bold',
//                             }}
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }












// import React, { useEffect, useState } from 'react';
// import { listIssues, createIssue, updateIssue as apiUpdateIssue } from '../../services/mockApi';
// import { useParams } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// // Mock epics
// const mockEpics = [
//   { id: 'epic-1', title: 'User Authentication' },
//   { id: 'epic-2', title: 'Dashboard & Reports' },
// ];

// export default function JiraBacklogWithSprints() {
//   const { projectId } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [newIssue, setNewIssue] = useState({ title: '', type: 'Story', storyPoints: 3, priority: 'P3', epicId: '' });
//   const [collapsedSprints, setCollapsedSprints] = useState({});

//   const priorityColors = { P1: '#e74c3c', P2: '#f1c40f', P3: '#2ecc71' };

//   useEffect(() => {
//     listIssues(projectId).then(setIssues);
//   }, [projectId]);

//   const addIssue = async () => {
//     if (!newIssue.title) return alert('Title required');
//     const data = { ...newIssue, projectId: projectId || null, status: 'backlog', assignee: '' };
//     await createIssue(data);
//     setIssues(await listIssues(projectId));
//     setNewIssue({ title: '', type: 'Story', storyPoints: 3, priority: 'P3', epicId: '' });
//   };

//   const updateField = async (id, field, value) => {
//     const updated = issues.map(i => (i.id === id ? { ...i, [field]: value } : i));
//     setIssues(updated);
//     const issueToUpdate = updated.find(i => i.id === id);
//     await apiUpdateIssue(id, issueToUpdate);
//   };

//   const deleteIssue = id => setIssues(prev => prev.filter(i => i.id !== id));

//   const onDragEnd = async result => {
//     const { source, destination } = result;
//     if (!destination) return;
//     const updated = Array.from(issues);
//     const [moved] = updated.splice(source.index, 1);
//     moved.status = destination.droppableId;
//     updated.splice(destination.index, 0, moved);
//     setIssues(updated);
//     await apiUpdateIssue(moved.id, moved);
//   };

//   // Group issues by status and epic
//   const columns = {
//     backlog: issues.filter(i => i.status === 'backlog'),
//     sprint1: issues.filter(i => i.status === 'sprint1'),
//     sprint2: issues.filter(i => i.status === 'sprint2'),
//     done: issues.filter(i => i.status === 'done'),
//   };

//   const renderIssues = (issueList) =>
//     issueList.map((issue, index) => (
//       <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
//         {provided => (
//           <div
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//             style={{
//               padding: '0.5rem',
//               marginBottom: '0.5rem',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               background: '#fff',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               ...provided.draggableProps.style,
//             }}
//           >
//             <div style={{ flex: 1 }}>
//               <input
//                 value={issue.title}
//                 onChange={e => updateField(issue.id, 'title', e.target.value)}
//                 style={{ fontWeight: 'bold', width: '100%', border: 'none', background: 'transparent' }}
//               />
//               <div style={{ fontSize: '12px', marginTop: '2px' }}>
//                 <select
//                   value={issue.type}
//                   onChange={e => updateField(issue.id, 'type', e.target.value)}
//                 >
//                   <option>Story</option>
//                   <option>Task</option>
//                   <option>Bug</option>
//                 </select>
//                 <span
//                   style={{
//                     background: '#e1e1e1',
//                     borderRadius: '12px',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                   }}
//                 >
//                   {issue.storyPoints} pts
//                 </span>
//                 <span
//                   style={{
//                     background: priorityColors[issue.priority],
//                     color: '#fff',
//                     borderRadius: '12px',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                   }}
//                 >
//                   {issue.priority}
//                 </span>
//                 <span
//                   style={{
//                     background: '#3498db',
//                     color: '#fff',
//                     borderRadius: '50%',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                     fontSize: '10px',
//                   }}
//                   title={issue.assignee || 'Unassigned'}
//                 >
//                   {issue.assignee ? issue.assignee[0].toUpperCase() : '?'}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => deleteIssue(issue.id)}
//               style={{
//                 marginLeft: '6px',
//                 border: 'none',
//                 background: 'transparent',
//                 color: '#e74c3c',
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </Draggable>
//     ));

//   return (
//     <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Project Board {projectId ? `- ${projectId}` : ''}</h2>

//       {/* Inline Add Issue */}
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
//         <input
//           placeholder="Title"
//           value={newIssue.title}
//           onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
//         />
//         <select value={newIssue.type} onChange={e => setNewIssue({ ...newIssue, type: e.target.value })}>
//           <option>Story</option>
//           <option>Task</option>
//           <option>Bug</option>
//         </select>
//         <input
//           type="number"
//           min={1}
//           value={newIssue.storyPoints}
//           onChange={e => setNewIssue({ ...newIssue, storyPoints: parseInt(e.target.value) })}
//           style={{ width: '60px' }}
//         />
//         <select value={newIssue.priority} onChange={e => setNewIssue({ ...newIssue, priority: e.target.value })}>
//           <option>P1</option>
//           <option>P2</option>
//           <option>P3</option>
//         </select>
//         <select value={newIssue.epicId} onChange={e => setNewIssue({ ...newIssue, epicId: e.target.value })}>
//           <option value="">No Epic</option>
//           {mockEpics.map(epic => (
//             <option key={epic.id} value={epic.id}>{epic.title}</option>
//           ))}
//         </select>
//         <button onClick={addIssue}>Add</button>
//       </div>

//       {/* Board Columns */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
//           {Object.keys(columns).map(status => (
//             <Droppable droppableId={status} key={status}>
//               {provided => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   style={{
//                     flex: 1,
//                     minHeight: '300px',
//                     padding: '0.5rem',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     background: '#f4f5f7',
//                   }}
//                 >
//                   <h3
//                     style={{
//                       textTransform: 'capitalize',
//                       cursor: status.startsWith('sprint') ? 'pointer' : 'default',
//                     }}
//                     onClick={() => status.startsWith('sprint') && setCollapsedSprints(prev => ({ ...prev, [status]: !prev[status] }))}
//                   >
//                     {status} {status.startsWith('sprint') ? (collapsedSprints[status] ? '▼' : '▲') : ''}
//                   </h3>
//                   {!collapsedSprints[status] &&
//                     mockEpics.map(epic => {
//                       const epicIssues = columns[status].filter(i => i.epicId === epic.id);
//                       if (!epicIssues.length) return null;
//                       return (
//                         <div key={epic.id} style={{ marginBottom: '0.5rem' }}>
//                           <strong style={{ display: 'block', marginBottom: '4px' }}>{epic.title}</strong>
//                           {renderIssues(epicIssues)}
//                         </div>
//                       );
//                     })}
//                   {/* Non-epic issues */}
//                   {!collapsedSprints[status] &&
//                     renderIssues(columns[status].filter(i => !i.epicId))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }









// import React, { useEffect, useState } from 'react';
// import { listIssues, createIssue, updateIssue as apiUpdateIssue } from '../../services/mockApi';
// import { useParams } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// // Mock epics
// const mockEpics = [
//   { id: 'epic-1', title: 'User Authentication' },
//   { id: 'epic-2', title: 'Dashboard & Reports' },
// ];

// export default function JiraBoardWithPoints() {
//   const { projectId } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [newIssue, setNewIssue] = useState({
//     title: '',
//     type: 'Story',
//     storyPoints: 3,
//     priority: 'P3',
//     epicId: '',
//     status: 'backlog',
//     assignee: '',
//   });
//   const [collapsedSprints, setCollapsedSprints] = useState({});
//   const priorityColors = { P1: '#e74c3c', P2: '#f1c40f', P3: '#2ecc71' };

//   useEffect(() => {
//     listIssues(projectId).then(setIssues);
//   }, [projectId]);

//   const addIssue = async () => {
//     if (!newIssue.title) return alert('Title required');
//     const data = { ...newIssue, projectId: projectId || null };
//     await createIssue(data);
//     setIssues(await listIssues(projectId));
//     setNewIssue({ title: '', type: 'Story', storyPoints: 3, priority: 'P3', epicId: '', status: 'backlog', assignee: '' });
//   };

//   const updateField = async (id, field, value) => {
//     const updated = issues.map(i => (i.id === id ? { ...i, [field]: value } : i));
//     setIssues(updated);
//     const issueToUpdate = updated.find(i => i.id === id);
//     await apiUpdateIssue(id, issueToUpdate);
//   };

//   const deleteIssue = id => setIssues(prev => prev.filter(i => i.id !== id));

//   const onDragEnd = async result => {
//     const { source, destination } = result;
//     if (!destination) return;
//     const updated = Array.from(issues);
//     const [moved] = updated.splice(source.index, 1);
//     moved.status = destination.droppableId;
//     updated.splice(destination.index, 0, moved);
//     setIssues(updated);
//     await apiUpdateIssue(moved.id, moved);
//   };

//   // Dynamically generate columns
//   const uniqueStatuses = Array.from(new Set(['backlog', ...issues.map(i => i.status), 'done']));
//   const columns = uniqueStatuses.reduce((acc, status) => {
//     acc[status] = issues.filter(i => i.status === status);
//     return acc;
//   }, {});

//   // Render issues list
//   const renderIssues = issueList =>
//     issueList.map((issue, index) => (
//       <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
//         {provided => (
//           <div
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//             style={{
//               padding: '0.5rem',
//               marginBottom: '0.5rem',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               background: '#fff',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               ...provided.draggableProps.style,
//             }}
//           >
//             <div style={{ flex: 1 }}>
//               <input
//                 value={issue.title}
//                 onChange={e => updateField(issue.id, 'title', e.target.value)}
//                 style={{ fontWeight: 'bold', width: '100%', border: 'none', background: 'transparent' }}
//               />
//               <div style={{ fontSize: '12px', marginTop: '2px' }}>
//                 <select value={issue.type} onChange={e => updateField(issue.id, 'type', e.target.value)}>
//                   <option>Story</option>
//                   <option>Task</option>
//                   <option>Bug</option>
//                 </select>
//                 <span
//                   style={{
//                     background: '#e1e1e1',
//                     borderRadius: '12px',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                   }}
//                 >
//                   {issue.storyPoints} pts
//                 </span>
//                 <span
//                   style={{
//                     background: priorityColors[issue.priority],
//                     color: '#fff',
//                     borderRadius: '12px',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                   }}
//                 >
//                   {issue.priority}
//                 </span>
//                 <span
//                   style={{
//                     background: '#3498db',
//                     color: '#fff',
//                     borderRadius: '50%',
//                     padding: '2px 6px',
//                     marginLeft: '6px',
//                     fontSize: '10px',
//                   }}
//                   title={issue.assignee || 'Unassigned'}
//                 >
//                   {issue.assignee ? issue.assignee[0].toUpperCase() : '?'}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => deleteIssue(issue.id)}
//               style={{
//                 marginLeft: '6px',
//                 border: 'none',
//                 background: 'transparent',
//                 color: '#e74c3c',
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </Draggable>
//     ));

//   // Calculate story points per column
//   const calculatePoints = issueList =>
//     issueList.reduce((sum, i) => sum + (parseInt(i.storyPoints) || 0), 0);

//   return (
//     <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Project Board {projectId ? `- ${projectId}` : ''}</h2>

//       {/* Add Issue */}
//       <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
//         <input
//           placeholder="Title"
//           value={newIssue.title}
//           onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
//         />
//         <select value={newIssue.type} onChange={e => setNewIssue({ ...newIssue, type: e.target.value })}>
//           <option>Story</option>
//           <option>Task</option>
//           <option>Bug</option>
//         </select>
//         <input
//           type="number"
//           min={1}
//           value={newIssue.storyPoints}
//           onChange={e => setNewIssue({ ...newIssue, storyPoints: parseInt(e.target.value) })}
//           style={{ width: '60px' }}
//         />
//         <select value={newIssue.priority} onChange={e => setNewIssue({ ...newIssue, priority: e.target.value })}>
//           <option>P1</option>
//           <option>P2</option>
//           <option>P3</option>
//         </select>
//         <select value={newIssue.epicId} onChange={e => setNewIssue({ ...newIssue, epicId: e.target.value })}>
//           <option value="">No Epic</option>
//           {mockEpics.map(epic => (
//             <option key={epic.id} value={epic.id}>{epic.title}</option>
//           ))}
//         </select>
//         <input
//           placeholder="Sprint (optional)"
//           value={newIssue.status.startsWith('sprint') ? newIssue.status : ''}
//           onChange={e => setNewIssue({ ...newIssue, status: e.target.value || 'backlog' })}
//         />
//         <button onClick={addIssue}>Add</button>
//       </div>

//       {/* Board */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
//           {uniqueStatuses.map(status => (
//             <Droppable droppableId={status} key={status}>
//               {provided => (
//                 <div
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   style={{
//                     flex: 1,
//                     minHeight: '300px',
//                     padding: '0.5rem',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px',
//                     background: '#f4f5f7',
//                   }}
//                 >
//                   <h3
//                     style={{
//                       textTransform: 'capitalize',
//                       cursor: status.startsWith('sprint') ? 'pointer' : 'default',
//                     }}
//                     onClick={() => status.startsWith('sprint') && setCollapsedSprints(prev => ({ ...prev, [status]: !prev[status] }))}
//                   >
//                     {status} {status.startsWith('sprint') ? (collapsedSprints[status] ? '▼' : '▲') : ''}
//                     {/* Story points total */}
//                     {status.startsWith('sprint') && ` — ${calculatePoints(columns[status])} pts`}
//                   </h3>

//                   {!collapsedSprints[status] &&
//                     mockEpics.map(epic => {
//                       const epicIssues = columns[status].filter(i => i.epicId === epic.id);
//                       if (!epicIssues.length) return null;
//                       return (
//                         <div key={epic.id} style={{ marginBottom: '0.5rem' }}>
//                           <strong style={{ display: 'block', marginBottom: '4px' }}>{epic.title}</strong>
//                           {renderIssues(epicIssues)}
//                         </div>
//                       );
//                     })}

//                   {!collapsedSprints[status] && renderIssues(columns[status].filter(i => !i.epicId))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }








//  for open board

// import React, { useEffect, useState } from 'react';
// import { listIssues, createIssue } from '../../services/mockApi';
// import { useParams } from 'react-router-dom';

// export default function Backlog() {
//   const { id } = useParams(); // <-- Use 'id', matching your route: /backlog/:id
//   const [issues, setIssues] = useState([]);
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('Story');
//   const [points, setPoints] = useState(3);

//   useEffect(() => {
//     listIssues(id).then(setIssues); // Pass project ID for API call
//   }, [id]);

//   const add = async () => {
//     const data = {
//       projectId: id || null,
//       title,
//       type,
//       status: 'todo',
//       priority: 'P3',
//       assignee: '',
//       storyPoints: points
//     };
//     await createIssue(data);
//     setIssues(await listIssues(id)); // Refresh issues after add
//     setTitle('');
//     setPoints(3);
//   };

//   return (
//     <div className="card" role="region" aria-labelledby="backlog-title">
//       <h2 id="backlog-title">Backlog {id ? `- ${id}` : ''}</h2>
//       <div style={{ display: 'flex', gap: 12 }}>
//         <div style={{ flex: 1 }}>
//           <div className="form-row">
//             <label>
//               Title
//               <input value={title} onChange={e => setTitle(e.target.value)} />
//             </label>
//           </div>
//           <div className="form-row">
//             <label>
//               Type
//               <select value={type} onChange={e => setType(e.target.value)}>
//                 <option>Story</option>
//                 <option>Task</option>
//                 <option>Bug</option>
//               </select>
//             </label>
//           </div>
//           <div className="form-row">
//             <label>
//               Story Points
//               <input
//                 type="number"
//                 value={points}
//                 onChange={e => setPoints(Number(e.target.value))}
//               />
//             </label>
//           </div>
//           <button className="btn" onClick={add}>
//             Add to Backlog
//           </button>
//         </div>
//         <div style={{ flex: 2 }}>
//           <h3>Backlog Items</h3>
//           <ul>
//             {issues.map(i => (
//               <li key={i.id}>
//                 {i.title} — <em>{i.type}</em> — {i.storyPoints} pts
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }









//today
import React, { useEffect, useState } from 'react';
import { listIssues, createIssue } from '../../services/mockApi';
import { useParams } from 'react-router-dom';

export default function Backlog() {
  const { id } = useParams(); // matches your route /backlog/:id
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Story');
  const [points, setPoints] = useState(3);

  // Load backlog issues when page loads or id changes
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await listIssues(id);

        // Make sure we always have an array
        setIssues(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load issues:', err);
        setIssues([]);
      }
    };
    fetchIssues();
  }, [id]);

  // Add new issue
  const add = async () => {
    if (!title.trim()) return;

    const newIssue = {
      projectId: id || null,
      title,
      type,
      status: 'todo',
      priority: 'P3',
      assignee: '',
      storyPoints: points,
    };

    try {
      await createIssue(newIssue);
      const refreshed = await listIssues(id);
      setIssues(Array.isArray(refreshed) ? refreshed : []);
      setTitle('');
      setPoints(3);
    } catch (err) {
      console.error('Failed to add issue:', err);
    }
  };

  return (
    <div className="card" role="region" aria-labelledby="backlog-title">
      <h2 id="backlog-title">Backlog {id ? `- ${id}` : ''}</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
          <div className="form-row">
            <label>
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Type
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Story</option>
                <option>Task</option>
                <option>Bug</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Story Points
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </label>
          </div>

          <button className="btn" onClick={add}>
            Add to Backlog
          </button>
        </div>

        {/* Right: List */}
        <div style={{ flex: 2 }}>
          <h3>Backlog Items</h3>
          {issues.length === 0 ? (
            <p>No issues found.</p>
          ) : (
            <ul>
              {issues.map((i) => (
                <li key={i.id}>
                  {i.title} — <em>{i.type}</em> — {i.storyPoints} pts
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

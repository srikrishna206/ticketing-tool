// import React, { useState } from 'react';
// import { createIssue } from '../../services/mockApi';
// import { useNavigate } from 'react-router-dom';

// export default function IssueCreate() {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('Task');
//   const nav = useNavigate();

//   const create = async ()=>{
//     await createIssue({ projectId:null, title, type, status:'todo', priority:'P3', assignee:'', storyPoints:0 });
//     nav('/for-you');
//   };

//   return (
//     <div className="card" role="region" aria-labelledby="create-issue">
//       <h2 id="create-issue">Create Issue</h2>
//       <div className="form-row"><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label></div>
//       <div className="form-row"><label>Type<select value={type} onChange={e=>setType(e.target.value)}><option>Task</option><option>Bug</option><option>Story</option></select></label></div>
//       <button className="btn" onClick={create}>Create</button>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

// // Mock API service
// const issuesDB = [];
// let idCounter = 1;

// const createIssue = async (issue) => {
//   const newIssue = { ...issue, id: idCounter++ };
//   issuesDB.push(newIssue);
//   return newIssue;
// };

// const getIssue = async (id) => issuesDB.find((i) => i.id === parseInt(id));
// const updateIssue = async (id, updatedFields) => {
//   const issue = issuesDB.find((i) => i.id === parseInt(id));
//   if (issue) Object.assign(issue, updatedFields);
//   return issue;
// };
// const getAllIssues = async () => issuesDB;

// // Create Issue Component
// function IssueCreate() {
//   const [title, setTitle] = useState('');
//   const [type, setType] = useState('Task');
//   const [priority, setPriority] = useState('P3');
//   const [reporter, setReporter] = useState('');
//   const [assignee, setAssignee] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const nav = useNavigate();

//   const create = async () => {
//     await createIssue({
//       projectId: null,
//       title,
//       type,
//       status: 'todo',
//       priority,
//       reporter,
//       assignee,
//       startDate,
//       endDate,
//       description: '',
//     });
//     nav('/issues');
//   };

//   return (
//     <div className="card">
//       <h2>Create Issue</h2>
//       <div className="form-row">
//         <label>Title<input value={title} onChange={e => setTitle(e.target.value)} /></label>
//       </div>
//       <div className="form-row">
//         <label>Type
//           <select value={type} onChange={e => setType(e.target.value)}>
//             <option>Task</option>
//             <option>Bug</option>
//             <option>Story</option>
//           </select>
//         </label>
//       </div>
//       <div className="form-row">
//         <label>Priority
//           <select value={priority} onChange={e => setPriority(e.target.value)}>
//             <option>P1</option>
//             <option>P2</option>
//             <option>P3</option>
//           </select>
//         </label>
//       </div>
//       <div className="form-row">
//         <label>Reporter<input value={reporter} onChange={e => setReporter(e.target.value)} /></label>
//       </div>
//       <div className="form-row">
//         <label>Assignee<input value={assignee} onChange={e => setAssignee(e.target.value)} /></label>
//       </div>
//       <div className="form-row">
//         <label>Start Date<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
//       </div>
//       <div className="form-row">
//         <label>End Date<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
//       </div>
//       <button className="btn" onClick={create}>Create</button>
//     </div>
//   );
// }

// // Issue Details Component
// function IssueDetails() {
//   const { id } = useParams();
//   const [issue, setIssue] = useState(null);
//   const [desc, setDesc] = useState('');

//   useEffect(() => {
//     if (id) getIssue(id).then(i => { setIssue(i); setDesc(i?.description || ''); });
//   }, [id]);

//   if (!issue) return <div className="card"><p>Issue not found</p></div>;

//   const save = async () => {
//     await updateIssue(issue.id, { description: desc });
//     setIssue(await getIssue(issue.id));
//   };

//   return (
//     <div className="card">
//       <h2>{issue.title} <span className="small">#{issue.id}</span></h2>
//       <p>Type: {issue.type} • Status: {issue.status} • Priority: {issue.priority}</p>
//       <p>Reporter: {issue.reporter} • Assignee: {issue.assignee}</p>
//       <p>Start: {issue.startDate || '-'} • End: {issue.endDate || '-'}</p>
//       <div className="form-row">
//         <label>Description<textarea value={desc} onChange={e => setDesc(e.target.value)} /></label>
//       </div>
//       <div style={{ display: 'flex', gap: 8 }}>
//         <button className="btn" onClick={save}>Save</button>
//       </div>
//     </div>
//   );
// }

// // Issues List (like mini Jira Board)
// function IssueBoard() {
//   const [issues, setIssues] = useState([]);
//   const nav = useNavigate();

//   useEffect(() => { getAllIssues().then(setIssues); }, []);

//   return (
//     <div>
//       <h2>Issues Board</h2>
//       <button className="btn" onClick={() => nav('/create')}>Create New Issue</button>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
//         {issues.map(issue => (
//           <div key={issue.id} className="card" style={{ width: 250, cursor: 'pointer' }} onClick={() => nav(`/details/${issue.id}`)}>
//             <h3>{issue.title}</h3>
//             <p>Type: {issue.type}</p>
//             <p>Priority: {issue.priority}</p>
//             <p>Status: {issue.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Main App
// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/create" element={<IssueCreate />} />
//         <Route path="/details/:id" element={<IssueDetails />} />
//         <Route path="/issues" element={<IssueBoard />} />
//         <Route path="*" element={<IssueBoard />} />
//       </Routes>
//     </Router>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIssue } from "../../services/mockApi";

export default function IssueCreate() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Task");
  const [priority, setPriority] = useState("P3");
  const [reporter, setReporter] = useState("");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const nav = useNavigate();

  const create = async () => {
    await createIssue({
      title,
      type,
      status: "todo",
      priority,
      reporter,
      assignee,
      startDate,
      endDate,
      description: "",
    });
    nav("/for-you");
  };

  return (
    <div className="card">
      <h2>Create Issue</h2>
      <div className="form-row">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Task</option>
            <option>Bug</option>
            <option>Story</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>P1</option>
            <option>P2</option>
            <option>P3</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Reporter
          <input
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Assignee
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <button className="btn" onClick={create}>
        Create
      </button>
    </div>
  );
}

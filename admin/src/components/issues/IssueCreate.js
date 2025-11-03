


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../../services/mockApi';

export default function IssueCreate() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Task');
  const [priority, setPriority] = useState('P3');
  const [reporter, setReporter] = useState('');
  const [assignee, setAssignee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const nav = useNavigate();

  const create = async () => {
    await createIssue({
      title,
      type,
      status: 'todo',
      priority,
      reporter,
      assignee,
      startDate,
      endDate,
      description: '',
    });
    nav('/for-you');
  };

  return (
    <div className="card">
      <h2>Create Issue</h2>
      <div className="form-row"><label>Title<input value={title} onChange={e => setTitle(e.target.value)} /></label></div>
      <div className="form-row"><label>Type
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>Task</option>
          <option>Bug</option>
          <option>Story</option>
        </select>
      </label></div>
      <div className="form-row"><label>Priority
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option>P1</option>
          <option>P2</option>
          <option>P3</option>
        </select>
      </label></div>
      <div className="form-row"><label>Reporter<input value={reporter} onChange={e => setReporter(e.target.value)} /></label></div>
      <div className="form-row"><label>Assignee<input value={assignee} onChange={e => setAssignee(e.target.value)} /></label></div>
      <div className="form-row"><label>Start Date<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label></div>
      <div className="form-row"><label>End Date<input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label></div>
      <button className="btn" onClick={create}>Create</button>
    </div>
  );
}

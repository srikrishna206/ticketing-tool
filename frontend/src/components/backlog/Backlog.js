//today
import React, { useEffect, useState } from "react";
import { listIssues, createIssue } from "../../services/mockApi";
import { useParams } from "react-router-dom";

export default function Backlog() {
  const { id } = useParams(); // matches your route /backlog/:id
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Story");
  const [points, setPoints] = useState(3);

  // Load backlog issues when page loads or id changes
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await listIssues(id);

        // Make sure we always have an array
        setIssues(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load issues:", err);
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
      status: "todo",
      priority: "P3",
      assignee: "",
      storyPoints: points,
    };

    try {
      await createIssue(newIssue);
      const refreshed = await listIssues(id);
      setIssues(Array.isArray(refreshed) ? refreshed : []);
      setTitle("");
      setPoints(3);
    } catch (err) {
      console.error("Failed to add issue:", err);
    }
  };

  return (
    <div className="card" role="region" aria-labelledby="backlog-title">
      <h2 id="backlog-title">Backlog {id ? `- ${id}` : ""}</h2>
      <div style={{ display: "flex", gap: 12 }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
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

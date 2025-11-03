// for separate boards

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject, listIssues } from "../../services/mockApi";

export default function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (id) {
      getProject(id).then(setProject);
      // Fetch only issues belonging to this project
      listIssues(id).then(setIssues);
    }
  }, [id]);

  if (!project)
    return (
      <div className="card">
        <p>Project not found</p>
      </div>
    );

  return (
    <div className="card" role="region" aria-labelledby="proj-title">
      <h2 id="proj-title">
        {project.name} <span className="small">({project.key})</span>
      </h2>
      <p>{project.description}</p>
      <div style={{ display: "flex", gap: 8 }}>
        {/* Each project has its own board */}
        <Link to={`/kanban/${project.id}`} className="btn">
          Open {project.name} Board
        </Link>
      </div>
      <hr />
      <h3>Issues</h3>
      <ul>
        {issues.length > 0 ? (
          issues.map((i) => (
            <li key={i.id}>
              <Link to={"/issues/" + i.id}>{i.title}</Link> —{" "}
              <em>{i.status}</em>
            </li>
          ))
        ) : (
          <li>No issues for this project yet.</li>
        )}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getIssue, updateIssue } from '../../services/mockApi';
import { useParams } from 'react-router-dom';

export default function IssueDetails() {
	const { id } = useParams();
	const [issue, setIssue] = useState(null);
	const [desc, setDesc] = useState('');

	useEffect(() => {
		if (id) {
			getIssue(id).then((i) => {
				setIssue(i);
				setDesc(i?.description || '');
			});
		}
	}, [id]);

	if (!issue)
		return (
			<div className="card">
				<p>Issue not found</p>
			</div>
		);

	const save = async () => {
		await updateIssue(issue.id, { description: desc });
		setIssue(await getIssue(issue.id));
	};

	return (
		<div className="card" role="region" aria-labelledby="issue-title">
			<h2 id="issue-title">
				{issue.title} <span className="small">#{issue.id}</span>
			</h2>
			<p>
				Type: {issue.type} • Status: {issue.status} • Priority: {issue.priority}
			</p>
			<div className="form-row">
				<label>
					Description
					<textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
				</label>
			</div>
			<div style={{ display: 'flex', gap: 8 }}>
				<button className="btn" onClick={save}>
					Save
				</button>
			</div>
		</div>
	);
}


import React, { useEffect, useState } from 'react';
import { listNotifs, markNotif, getCurrentUser } from '../../services/mockApi';

export default function Notifications() {
  const user = getCurrentUser();
  const [notifs, setNotifs] = useState([]);
  useEffect(()=>{ if(user) listNotifs(user.id).then(setNotifs); },[user]);

  const mark = async (id)=>{ await markNotif(id); setNotifs(await listNotifs(user.id)); };

  return (
    <div className="card" role="region" aria-labelledby="notifs-title">
      <h2 id="notifs-title">Notifications</h2>
      <ul>{notifs.map(n=>(<li key={n.id} style={{display:'flex',justifyContent:'space-between'}}><span>{n.text} <small className="small">• {new Date(n.ts).toLocaleString()}</small></span><div><button className="btn" onClick={()=>mark(n.id)}>Mark read</button></div></li>))}</ul>
    </div>
  );
}

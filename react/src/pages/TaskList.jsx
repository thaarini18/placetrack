import { useState, useEffect } from 'react';
import '../styles/TaskList.css';

const API = import.meta.env.VITE_API_URL;

export default function TaskList() {
  const [records, setRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const res = await fetch(`${API}/api/tasks`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025' 
        }
      });
      const data = await res.json();
      if (res.ok) setRecords(data);
    } catch (err) {
      console.error('Could not fetch records:', err);
    }
  }

  async function handleToggle(id) {
    try {
      const res = await fetch(`${API}/api/update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025'
        }
      });
      if (res.ok) loadRecords();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025'
        }
      });
      if (res.ok) loadRecords();
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = records.filter(r => 
    (filterStatus==='All'||r.status===filterStatus) &&
    (filterType==='All'||r.type===filterType)
  );

  function formatCtc(ctc) {
    return ctc>=100000 ? '₹'+(ctc/100000).toFixed(1)+' LPA' : '₹'+ctc.toLocaleString('en-IN')+'/mo';
  }

  return (
    <div className="page-list">
      <div className="page-header">
        <h1>👩‍🏫 Faculty Review Panel</h1>
        <p className="subtitle">Review, approve, or reject student submissions.</p>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span>Status:</span>
          {['All','Pending','Approved','Rejected'].map(s=>(
            <button key={s} className={filterStatus===s?'active':''} onClick={()=>setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className="filter-group">
          <span>Type:</span>
          {['All','Internship','Placement'].map(t=>(
            <button key={t} className={filterType===t?'active':''} onClick={()=>setFilterType(t)}>{t}</button>
          ))}
        </div>
      </div>

      {filtered.length===0 && <div className="empty-state"><p>No records match your filters.</p></div>}

      <div className="records-grid">
        {filtered.map(r=>(
          <div key={r._id} className={`record-card status-${r.status.toLowerCase()}`}>
            <div className="card-top">
              <p className="student-name">{r.studentName}</p>
              <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
            </div>
            <div className="card-meta">
              <span>💰 {formatCtc(r.ctc)}</span>
              <span>🏷️ {r.type}</span>
              <span>#ID {r._id.slice(-5)}</span>
            </div>
            <div className="card-actions">
              <button onClick={()=>handleToggle(r._id)}>🔄 Toggle Status</button>
              <button onClick={()=>handleDelete(r._id)}>🗑️ Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

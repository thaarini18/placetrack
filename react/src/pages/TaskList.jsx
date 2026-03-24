import { useState, useEffect } from 'react';
import '../styles/TaskList.css';

const API = import.meta.env.VITE_API_URL;

export default function TaskList({ reloadFlag }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, [reloadFlag]);

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
      console.error(err);
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

  const filtered = records;

  return (
    <div className="page-list">
      <h1>Faculty Review Panel</h1>
      {filtered.length === 0 && <p>No records found.</p>}
      {filtered.map(r => (
        <div key={r._id} className={`record-card status-${r.status.toLowerCase()}`}>
          <div>
            <strong>{r.studentName}</strong> @ {r.company} — {r.role} ({r.type})
          </div>
          <div>CTC: ₹{r.ctc}</div>
          <div>Status: {r.status}</div>
          <button onClick={() => handleToggle(r._id)}>Toggle Status</button>
          <button onClick={() => handleDelete(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

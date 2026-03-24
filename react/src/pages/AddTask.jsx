import '../styles/AddTask.css';
import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL; // Backend URL

export default function AddTask() {
  const [tasks, setTasks] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [type, setType] = useState('Internship');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all tasks on component load
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/api/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025',
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setErrorMsg('Could not fetch tasks. Backend may be down.');
    }
  }

  async function addTask() {
    setErrorMsg('');
    if (!studentName.trim() || !company.trim() || !role.trim() || !ctc) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      const res = await fetch(`${API}/api/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025',
        },
        body: JSON.stringify({ studentName, company, role, ctc: Number(ctc), type }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong');
        return;
      }

      // Success
      setSubmitted(true);
      setStudentName('');
      setCompany('');
      setRole('');
      setCtc('');
      setType('Internship');
      fetchTasks(); // Refresh task list
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Add task error:', err);
      setErrorMsg('Could not connect to backend.');
    }
  }

  async function updateStatus(id) {
    try {
      const res = await fetch(`${API}/api/update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025',
        },
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Update status error:', err);
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API}/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025',
        },
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
    }
  }

  return (
    <div className="page-add">
      <div className="page-header">
        <h1>Student Portal</h1>
        <p className="subtitle">
          Submit your internship or placement details for approval.
        </p>
      </div>

      {submitted && (
        <div className="alert alert-success">
          Submission successful! Your record has been sent for faculty review.
        </div>
      )}

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <div className="placement-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              placeholder="e.g. Aisha Patel"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role / Designation</label>
            <input
              type="text"
              placeholder="e.g. SWE Intern"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>CTC / Stipend (₹)</label>
            <input
              type="number"
              placeholder="e.g. 80000"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label>Opportunity Type</label>
            <div className="radio-group">
              <label className={`radio-option ${type === 'Internship' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="Internship"
                  checked={type === 'Internship'}
                  onChange={() => setType('Internship')}
                />
                🏢 Internship
              </label>
              <label className={`radio-option ${type === 'Placement' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="Placement"
                  checked={type === 'Placement'}
                  onChange={() => setType('Placement')}
                />
                💼 Full-Time Placement
              </label>
            </div>
          </div>
        </div>

        <button className="btn-submit" onClick={addTask}>
          Submit Application →
        </button>
      </div>

      {/* ====== Tasks Table ====== */}
      {tasks.length > 0 && (
        <div className="tasks-table">
          <h2>Submitted Records</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Role</th>
                <th>CTC</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.studentName}</td>
                  <td>{task.company}</td>
                  <td>{task.role}</td>
                  <td>{task.ctc}</td>
                  <td>{task.type}</td>
                  <td>{task.status}</td>
                  <td>
                    <button onClick={() => updateStatus(task._id)}>Cycle Status</button>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

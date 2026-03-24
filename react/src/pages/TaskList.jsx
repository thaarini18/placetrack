import '../styles/AddTask.css';
import { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function AddTask({ onTaskAdded }) {
  const [studentName, setStudentName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [type, setType] = useState('Internship');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

      setSubmitted(true);
      setStudentName('');
      setCompany('');
      setRole('');
      setCtc('');
      setType('Internship');

      // Notify parent component to reload tasks
      if (onTaskAdded) onTaskAdded();

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Add task error:', err);
      setErrorMsg('Could not connect to backend.');
    }
  }

  return (
    <div className="page-add">
      <div className="page-header">
        <h1>Student Portal</h1>
        <p className="subtitle">Submit your internship or placement details for approval.</p>
      </div>

      {submitted && <div className="alert alert-success">Submission successful!</div>}
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <div className="placement-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g. Aisha Patel"/>
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google"/>
          </div>
          <div className="form-group">
            <label>Role / Designation</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. SWE Intern"/>
          </div>
          <div className="form-group">
            <label>CTC / Stipend (₹)</label>
            <input type="number" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 80000"/>
          </div>
          <div className="form-group full-width">
            <label>Opportunity Type</label>
            <div className="radio-group">
              <label className={`radio-option ${type==='Internship'?'selected':''}`}>
                <input type="radio" value="Internship" checked={type==='Internship'} onChange={()=>setType('Internship')}/> 🏢 Internship
              </label>
              <label className={`radio-option ${type==='Placement'?'selected':''}`}>
                <input type="radio" value="Placement" checked={type==='Placement'} onChange={()=>setType('Placement')}/> 💼 Full-Time Placement
              </label>
            </div>
          </div>
        </div>

        <button className="btn-submit" onClick={addTask}>Submit Application →</button>
      </div>
    </div>
  );
}

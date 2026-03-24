import '../styles/AddTask.css'
import { useState } from 'react'

const API = import.meta.env.VITE_API_URL;  // ✅ added

export default function AddTask() {
  const [studentName, setStudentName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [ctc, setCtc] = useState('')
  const [type, setType] = useState('Internship')
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handler() {
    setErrorMsg('')

    if (!studentName.trim() || !company.trim() || !role.trim() || !ctc) {
      setErrorMsg('All fields are required.')
      return
    }

    try {
      const res = await fetch(`${API}/api/add`, {   // ✅ changed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'placetrack2025'
        },
        body: JSON.stringify({ studentName, company, role, ctc: Number(ctc), type })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
        return
      }

      if (res.ok) {
        setSubmitted(true)
        setStudentName('')
        setCompany('')
        setRole('')
        setCtc('')
        setType('Internship')
        setTimeout(() => setSubmitted(false), 3000)
      }

    } catch (err) {
      setErrorMsg('Could not connect to server. Is the backend running?')
    }
  }

  return (
    <div className="page-add">
      <div className="page-header">
        <h1>Student Portal</h1>
        <p className="subtitle">Submit your internship or placement details for approval.</p>
      </div>

      {submitted && (
        <div className="alert alert-success">
          Submission successful! Your record has been sent for faculty review.
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">{errorMsg}</div>
      )}

      <div className="placement-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student Name</label>
            <input type="text" placeholder="e.g. Aisha Patel"
              value={studentName} onChange={e => setStudentName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input type="text" placeholder="e.g. Google"
              value={company} onChange={e => setCompany(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Role / Designation</label>
            <input type="text" placeholder="e.g. SWE Intern"
              value={role} onChange={e => setRole(e.target.value)} />
          </div>

          <div className="form-group">
            <label>CTC / Stipend (₹)</label>
            <input type="number" placeholder="e.g. 80000"
              value={ctc} onChange={e => setCtc(e.target.value)} />
          </div>

          <div className="form-group full-width">
            <label>Opportunity Type</label>
            <div className="radio-group">
              <label className={`radio-option ${type === 'Internship' ? 'selected' : ''}`}>
                <input type="radio" value="Internship"
                  checked={type === 'Internship'} onChange={() => setType('Internship')} />
                🏢 Internship
              </label>
              <label className={`radio-option ${type === 'Placement' ? 'selected' : ''}`}>
                <input type="radio" value="Placement"
                  checked={type === 'Placement'} onChange={() => setType('Placement')} />
                💼 Full-Time Placement
              </label>
            </div>
          </div>
        </div>

        <button className="btn-submit" onClick={handler}>
          Submit Application →
        </button>
      </div>
    </div>
  )
}

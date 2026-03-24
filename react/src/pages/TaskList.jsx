import { useState, useEffect } from 'react'
import '../styles/TaskList.css'

const STORAGE_KEY = 'placetrack_records'

export default function TaskList() {
  const [records, setRecords] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      setRecords(JSON.parse(cached))
      return
    }

    try {
      const res = await fetch('http://localhost:3500/api/tasks', {
        headers: { 'x-api-key': 'placetrack2025' }
      })

      const data = await res.json()
      setRecords(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    } catch (err) {
      console.error('Could not fetch records:', err)
    }
  }

  function saveToStorage(updated) {
    setRecords(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  async function handleToggle(id) {
    try {
      const res = await fetch(`http://localhost:3500/api/update/${id}`, {
        headers: { 'x-api-key': 'placetrack2025' }
      })

      const updatedRecord = await res.json()

      const updatedList = records.map(r =>
        r._id === updatedRecord._id ? updatedRecord : r
      )

      saveToStorage(updatedList)

    } catch (err) {
      console.error('Could not update record:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:3500/api/delete/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': 'placetrack2025' }
      })

      const updatedList = records.filter(r => r._id !== id)
      saveToStorage(updatedList)

    } catch (err) {
      console.error('Could not delete record:', err)
    }
  }

  function handleRefresh() {
    localStorage.removeItem(STORAGE_KEY)
    loadRecords()
  }

  function formatCtc(ctc) {
    return ctc >= 100000
      ? '₹' + (ctc / 100000).toFixed(1) + ' LPA'
      : '₹' + ctc.toLocaleString('en-IN') + '/mo'
  }

  const filtered = records.filter(r => {
    const statusOk = filterStatus === 'All' || r.status === filterStatus
    const typeOk = filterType === 'All' || r.type === filterType
    return statusOk && typeOk
  })

  return (
    <div className="page-list">
      <div className="page-header">
        <h1>👩‍🏫 Faculty Review Panel</h1>
        <p className="subtitle">Review, approve, or reject student submissions.</p>
      </div>

      <div className="storage-bar">
        <span className="storage-info">
          💾 {records.length} records saved in Local Storage
        </span>
        <button className="btn-refresh" onClick={handleRefresh}>
          🔄 Refresh from Server
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Type:</span>
          {['All', 'Internship', 'Placement'].map(t => (
            <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span>🔍</span>
          <p>No records match your filters.</p>
        </div>
      )}

      <div className="records-grid">
        {filtered.map(rec => (
          <div key={rec._id} className={`record-card status-${rec.status.toLowerCase()}`}>
            <div className="card-top">
              <div className="student-info">
                <span className="student-avatar">{rec.studentName[0]}</span>
                <div>
                  <p className="student-name">{rec.studentName}</p>
                  <p className="student-role">{rec.role} @ {rec.company}</p>
                </div>
              </div>
              <span className={`badge badge-${rec.status.toLowerCase()}`}>{rec.status}</span>
            </div>

            <div className="card-meta">
              <span className="meta-item">
                <span className="meta-icon">💰</span>{formatCtc(rec.ctc)}
              </span>
              <span className="meta-item">
                <span className="meta-icon">🏷️</span>{rec.type}
              </span>
              <span className="meta-item">
                <span className="meta-icon">#</span>ID {rec._id.slice(-5)}
              </span>
            </div>

            <div className="card-actions">
              <button className="btn-cycle" onClick={() => handleToggle(rec._id)}>
                🔄 Toggle Status
              </button>
              <button className="btn-delete" onClick={() => handleDelete(rec._id)}>
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

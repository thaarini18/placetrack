import { useState, useEffect, useMemo } from 'react'
import '../styles/TaskStatistics.css'

const API = import.meta.env.VITE_API_URL

export default function TaskStatistics() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await fetch(`${API}/api/tasks`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', // ✅ added for consistency
            'x-api-key': 'placetrack2025'       // ✅ API key
          }
        })

        const data = await res.json()

        if (!res.ok) {
          console.error(data.error)
          return
        }

        setRecords(data)
      } catch (err) {
        console.error('Could not fetch records:', err)
      }
    }
    fetchRecords()
  }, [])

  const stats = useMemo(() => {
    const total = records.length
    const placements = records.filter(r => r.type === 'Placement')
    const internships = records.filter(r => r.type === 'Internship')
    const approved = records.filter(r => r.status === 'Approved')

    const totalPlaced = placements.filter(r => r.status === 'Approved').length
    const pctPlaced = total > 0 ? Math.round((approved.length / total) * 100) : 0

    const avgCtc = approved.length > 0
      ? Math.round(approved.reduce((s, r) => s + r.ctc, 0) / approved.length)
      : 0

    return {
      total,
      totalPlacements: placements.length,
      totalInternships: internships.length,
      totalPlaced,
      pctPlaced,
      avgCtc
    }
  }, [records])

  function formatCtc(ctc) {
    return ctc >= 100000
      ? '₹' + (ctc / 100000).toFixed(1) + ' LPA'
      : '₹' + ctc.toLocaleString('en-IN') + '/mo'
  }

  const recentRecords = records.slice(-5).reverse()

  return (
    <div className="page-stats">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Placement statistics and performance overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-body">
            <p className="stat-label">Total Records</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-body">
            <p className="stat-label">Total Placed</p>
            <p className="stat-value">{stats.totalPlaced}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-body">
            <p className="stat-label">Internships</p>
            <p className="stat-value">{stats.totalInternships}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-body">
            <p className="stat-label">% Approved</p>
            <p className="stat-value">{stats.pctPlaced}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-body">
            <p className="stat-label">Avg Approved CTC</p>
            <p className="stat-value">{formatCtc(stats.avgCtc)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-body">
            <p className="stat-label">Placements</p>
            <p className="stat-value">{stats.totalPlacements}</p>
          </div>
        </div>
      </div>

      <div className="section-title">Recent Submissions</div>

      <div className="recent-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Company</th>
              <th>Role</th>
              <th>Type</th>
              <th>CTC</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentRecords.map(rec => (
              <tr key={rec._id}>
                <td className="id-col">{rec._id.slice(-5)}</td>
                <td className="name-col">{rec.studentName}</td>
                <td>{rec.company}</td>
                <td>{rec.role}</td>
                <td><span className="type-badge">{rec.type}</span></td>
                <td>{formatCtc(rec.ctc)}</td>
                <td>
                  <span className={`badge badge-${rec.status.toLowerCase()}`}>
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

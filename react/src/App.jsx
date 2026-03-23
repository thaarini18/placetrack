import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import AddTask from './pages/AddTask.jsx'
import TaskList from './pages/TaskList.jsx'
import TaskStatistics from './pages/TaskStatistics.jsx'
import './styles/global.css'

function NavBar() {
  const location = useLocation()
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">PlaceTrack</span>
        </div>
        <nav className="main-nav">
          <Link to="/student" className={location.pathname === '/student' ? 'active' : ''}>
            Student
          </Link>
          <Link to="/faculty" className={location.pathname === '/faculty' ? 'active' : ''}>
            Faculty
          </Link>
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AddTask />} />
            <Route path="/student" element={<AddTask />} />
            <Route path="/faculty" element={<TaskList />} />
            <Route path="/admin" element={<TaskStatistics />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>PlaceTrack — Internship & Placement Portal © 2025</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
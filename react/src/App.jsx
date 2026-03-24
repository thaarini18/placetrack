import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AddTask from './pages/AddTask.jsx';
import TaskList from './pages/TaskList.jsx';
import TaskStatistics from './pages/TaskStatistics.jsx';
import './styles/global.css';

function NavBar() {
  const location = useLocation();
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">PlaceTrack</span>
        </div>
        <nav className="main-nav">
          <Link to="/student" className={location.pathname === '/student' ? 'active' : ''}>Student</Link>
          <Link to="/faculty" className={location.pathname === '/faculty' ? 'active' : ''}>Faculty</Link>
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const handleTaskAdded = () => setReloadFlag(prev => !prev);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/student" />} />
            <Route path="/student" element={<AddTask onTaskAdded={handleTaskAdded} />} />
            <Route path="/faculty" element={<TaskList reloadFlag={reloadFlag} />} />
            <Route path="/admin" element={<TaskStatistics />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>PlaceTrack — Internship & Placement Portal © 2025</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

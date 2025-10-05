import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import TaskManager from './components/TaskManager'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

const handleLogin = (userData, token) => {
  setUser(userData);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  // Clear ALL task-related localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('tasks') || key.includes('task')) {
      localStorage.removeItem(key);
    }
  });
  setError('');
}

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Clear ALL task-related localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('tasks') || key.includes('task')) {
      localStorage.removeItem(key);
    }
  });
  setError('');
}

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" />
        <p>Loading Task Manager...</p>
      </div>
    )
  }

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      {user ? (
        <TaskManager 
          key={user.id} // This forces re-render when user changes
          user={user} 
          onLogout={handleLogout}
          onError={showError}
        />
      ) : (
        <Login 
          onLogin={handleLogin}
          onError={showError}
        />
      )}
    </div>
  )
}

export default App

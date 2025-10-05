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

  // Function to clear ALL task-related storage
  const clearAllTaskStorage = () => {
    console.log('Clearing task storage...');
    const keysToRemove = [];
    
    // Check all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.toLowerCase().includes('task') ||
        key.toLowerCase().includes('todo') ||
        key.toLowerCase().includes('taskmanager') ||
        key === 'tasks' ||
        key === 'taskState' ||
        key === 'taskFilter' ||
        key === 'newTask'
      )) {
        keysToRemove.push(key);
        console.log('Removing storage key:', key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Also clear sessionStorage for task data
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.toLowerCase().includes('task')) {
        sessionStorage.removeItem(key);
        console.log('Removing sessionStorage key:', key);
      }
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Clear task storage when user changes
  useEffect(() => {
    if (user) {
      clearAllTaskStorage();
    }
  }, [user])

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
    // Clear task storage BEFORE setting user
    clearAllTaskStorage();
    
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setError('');
    
    console.log('User logged in:', userData.id);
  }

  const handleLogout = () => {
    // Clear task storage BEFORE logout
    clearAllTaskStorage();
    
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError('');
    
    console.log('User logged out');
  }

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  // Debug function to check storage
  const debugStorage = () => {
    console.log('=== STORAGE DEBUG ===');
    console.log('Current user:', user);
    console.log('LocalStorage keys:');
    Object.keys(localStorage).forEach(key => {
      console.log(`  ${key}:`, localStorage.getItem(key));
    });
    console.log('SessionStorage keys:');
    Object.keys(sessionStorage).forEach(key => {
      console.log(`  ${key}:`, sessionStorage.getItem(key));
    });
    console.log('=====================');
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
      {/* Debug button - remove in production */}
      <button 
        onClick={debugStorage}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
      >
        Debug Storage
      </button>
      
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      {user ? (
        <TaskManager 
          key={`taskmanager-${user.id}-${Date.now()}`} // More unique key
          user={user} 
          onLogout={handleLogout}
          onError={showError}
          clearTasksOnMount={true} // New prop to force reset
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

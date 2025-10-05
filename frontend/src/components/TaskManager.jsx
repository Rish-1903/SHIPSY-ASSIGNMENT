import React, { useState, useEffect } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import StatsDashboard from './StatsDashboard'
import './TaskManager.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TaskManager = ({ user, onLogout, onError }) => {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [activeView, setActiveView] = useState('list') // 'list' or 'stats'
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    isUrgent: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const fetchTasks = async (page = 1) => {
    setLoading(true)
    const token = localStorage.getItem('token')
    
    const queryParams = new URLSearchParams({
      page,
      limit: 8,
      ...filters
    }).toString()

    try {
      const response = await fetch(
        `${API_BASE}/tasks?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks)
        setPagination(data.pagination)
      } else {
        const errorData = await response.json()
        onError(errorData.message || 'Failed to fetch tasks')
      }
    } catch (error) {
      onError('Network error while fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/tasks/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters])

  useEffect(() => {
    if (activeView === 'stats') {
      fetchStats()
    }
  }, [activeView])

  const handleCreateTask = async (taskData) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        setShowForm(false)
        fetchTasks()
        if (activeView === 'stats') fetchStats()
        onError('Task created successfully!')
      } else {
        const errorData = await response.json()
        onError(errorData.message || 'Failed to create task')
      }
    } catch (error) {
      onError('Network error while creating task')
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        setEditingTask(null)
        fetchTasks(pagination.current)
        if (activeView === 'stats') fetchStats()
        onError('Task updated successfully!')
      } else {
        const errorData = await response.json()
        onError(errorData.message || 'Failed to update task')
      }
    } catch (error) {
      onError('Network error while updating task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchTasks(pagination.current)
        if (activeView === 'stats') fetchStats()
        onError('Task deleted successfully!')
      } else {
        const errorData = await response.json()
        onError(errorData.message || 'Failed to delete task')
      }
    } catch (error) {
      onError('Network error while deleting task')
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handlePageChange = (page) => {
    fetchTasks(page)
  }

  return (
    <div className="task-manager">
      <header className="task-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Task Manager</h1>
            <p>Welcome back, {user.username}!</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveView(activeView === 'list' ? 'stats' : 'list')}
            >
              {activeView === 'list' ? 'View Stats' : 'View Tasks'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + New Task
            </button>
            <button 
              className="btn btn-secondary"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="task-content container">
        {activeView === 'list' ? (
          <TaskList
            tasks={tasks}
            filters={filters}
            pagination={pagination}
            loading={loading}
            onFilterChange={handleFilterChange}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onPageChange={handlePageChange}
          />
        ) : (
          <StatsDashboard stats={stats} />
        )}

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TaskManager

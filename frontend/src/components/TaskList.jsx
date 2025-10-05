import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import './TaskList.css'

const TaskList = ({ 
  tasks, 
  filters, 
  pagination, 
  loading, 
  onFilterChange, 
  onEdit, 
  onDelete, 
  onPageChange 
}) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value)
  }

  const clearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      isUrgent: '',
      search: ''
    })
  }

  const hasActiveFilters = filters.status || filters.priority || filters.isUrgent || filters.search

  if (loading) {
    return (
      <div className="loading-state">
        <LoadingSpinner size="large" />
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Your Tasks</h2>
        {hasActiveFilters && (
          <button 
            className="btn btn-secondary clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>

        <select 
          value={filters.priority} 
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select 
          value={filters.isUrgent} 
          onChange={(e) => handleFilterChange('isUrgent', e.target.value)}
          className="filter-select"
        >
          <option value="">All Urgency</option>
          <option value="true">Urgent</option>
          <option value="false">Not Urgent</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results.' 
              : 'Get started by creating your first task!'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={!pagination.hasPrev}
                onClick={() => onPageChange(pagination.current - 1)}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.current} of {pagination.pages}
                <br />
                <small>{pagination.total} total tasks</small>
              </span>
              
              <button
                className="btn btn-secondary"
                disabled={!pagination.hasNext}
                onClick={() => onPageChange(pagination.current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getEfficiencyColor = (score) => {
    if (score >= 100) return 'efficiency-high'
    if (score >= 80) return 'efficiency-medium'
    if (score >= 50) return 'efficiency-low'
    return 'efficiency-poor'
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button 
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button 
            className="btn-icon"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <span className={`status status-${task.status}`}>
          {task.status.replace('-', ' ')}
        </span>
        <span className={`priority priority-${task.priority}`}>
          {task.priority}
        </span>
        {task.isUrgent && <span className="urgent">Urgent</span>}
      </div>

      <div className="task-hours">
        <div className="hour-item">
          <span className="hour-label">Estimated:</span>
          <span className="hour-value">{task.estimatedHours}h</span>
        </div>
        <div className="hour-item">
          <span className="hour-label">Actual:</span>
          <span className="hour-value">{task.actualHours}h</span>
        </div>
        <div className="hour-item">
          <span className="hour-label">Efficiency:</span>
          <span className={`efficiency ${getEfficiencyColor(task.efficiencyScore)}`}>
            {task.efficiencyScore.toFixed(1)}%
          </span>
        </div>
      </div>

      {task.dueDate && (
        <div className="due-date">
          <span className="due-label">Due:</span>
          <span className="due-value">{formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className="task-footer">
        <span className="created-date">
          Created: {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default TaskList

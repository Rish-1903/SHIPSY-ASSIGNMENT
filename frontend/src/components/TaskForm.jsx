import React, { useState, useEffect } from 'react'
import './TaskForm.css'

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    isUrgent: false,
    estimatedHours: 0,
    actualHours: 0,
    dueDate: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        isUrgent: task.isUrgent || false,
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters'
    }

    if (formData.estimatedHours < 0 || formData.estimatedHours > 1000) {
      newErrors.estimatedHours = 'Estimated hours must be between 0 and 1000'
    }

    if (formData.actualHours < 0 || formData.actualHours > 1000) {
      newErrors.actualHours = 'Actual hours must be between 0 and 1000'
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        estimatedHours: parseFloat(formData.estimatedHours),
        actualHours: parseFloat(formData.actualHours)
      }

      if (task) {
        await onSubmit(task._id, submitData)
      } else {
        await onSubmit(submitData)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateEfficiency = () => {
    const estimated = parseFloat(formData.estimatedHours) || 0
    const actual = parseFloat(formData.actualHours) || 0
    
    if (estimated === 0) return 0
    if (actual === 0) return 100
    
    return (estimated / actual) * 100
  }

  const efficiency = calculateEfficiency()
  const efficiencyColor = efficiency >= 100 ? 'efficiency-high' : 
                         efficiency >= 80 ? 'efficiency-medium' : 
                         efficiency >= 50 ? 'efficiency-low' : 'efficiency-poor'

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            className="close-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter task title"
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the task in detail..."
              rows="4"
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedHours" className="form-label">
                Estimated Hours
              </label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={handleChange}
                className={`form-input ${errors.estimatedHours ? 'error' : ''}`}
                min="0"
                max="1000"
                step="0.5"
                disabled={isSubmitting}
              />
              {errors.estimatedHours && (
                <span className="error-message">{errors.estimatedHours}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="actualHours" className="form-label">
                Actual Hours
              </label>
              <input
                id="actualHours"
                name="actualHours"
                type="number"
                value={formData.actualHours}
                onChange={handleChange}
                className={`form-input ${errors.actualHours ? 'error' : ''}`}
                min="0"
                max="1000"
                step="0.5"
                disabled={isSubmitting}
              />
              {errors.actualHours && (
                <span className="error-message">{errors.actualHours}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-input ${errors.dueDate ? 'error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <span className="error-message">{errors.dueDate}</span>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="checkmark"></span>
                Mark as Urgent
              </label>
            </div>
          </div>

          {(formData.estimatedHours > 0 || formData.actualHours > 0) && (
            <div className="efficiency-preview">
              <span className="efficiency-label">Estimated Efficiency:</span>
              <span className={`efficiency-value ${efficiencyColor}`}>
                {efficiency.toFixed(1)}%
              </span>
              <div className="efficiency-explanation">
                {efficiency >= 100 ? 'Ahead of schedule' :
                 efficiency >= 80 ? 'On track' :
                 efficiency >= 50 ? 'Slightly behind' : 'Behind schedule'}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm

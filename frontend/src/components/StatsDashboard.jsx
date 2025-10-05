import React from 'react'
import './StatsDashboard.css'

const StatsDashboard = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-loading">
        <p>Loading statistics...</p>
      </div>
    )
  }

  const { byStatus, totalTasks, urgentTasks } = stats

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', icon: '⏳' },
    'in-progress': { label: 'In Progress', color: '#3b82f6', icon: '🔄' },
    completed: { label: 'Completed', color: '#10b981', icon: '✅' },
    'on-hold': { label: 'On Hold', color: '#6b7280', icon: '⏸️' }
  }

  const totalEstimated = byStatus.reduce((sum, item) => sum + (item.totalEstimatedHours || 0), 0)
  const totalActual = byStatus.reduce((sum, item) => sum + (item.totalActualHours || 0), 0)
  const overallEfficiency = totalActual > 0 ? (totalEstimated / totalActual) * 100 : 0

  return (
    <div className="stats-dashboard">
      <h2>Task Statistics</h2>
      
      <div className="stats-overview">
        <div className="stat-card total-tasks">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="stat-card urgent-tasks">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{urgentTasks}</h3>
            <p>Urgent Tasks</p>
          </div>
        </div>
        
        <div className="stat-card efficiency">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{overallEfficiency.toFixed(1)}%</h3>
            <p>Overall Efficiency</p>
          </div>
        </div>
        
        <div className="stat-card hours-tracked">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{totalActual}h</h3>
            <p>Hours Tracked</p>
          </div>
        </div>
      </div>

      <div className="stats-details">
        <div className="status-breakdown">
          <h3>Tasks by Status</h3>
          <div className="status-list">
            {byStatus.map(item => {
              const config = statusConfig[item._id] || { label: item._id, color: '#6b7280', icon: '📝' }
              const percentage = totalTasks > 0 ? (item.count / totalTasks) * 100 : 0
              
              return (
                <div key={item._id} className="status-item">
                  <div className="status-header">
                    <span className="status-icon">{config.icon}</span>
                    <span className="status-name">{config.label}</span>
                    <span className="status-count">{item.count}</span>
                  </div>
                  <div className="status-bar">
                    <div 
                      className="status-progress"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                  <div className="status-meta">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>Est: {item.totalEstimatedHours || 0}h</span>
                    <span>Act: {item.totalActualHours || 0}h</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="efficiency-breakdown">
          <h3>Efficiency Analysis</h3>
          <div className="efficiency-metrics">
            <div className="efficiency-item">
              <span className="metric-label">Total Estimated Hours:</span>
              <span className="metric-value">{totalEstimated}h</span>
            </div>
            <div className="efficiency-item">
              <span className="metric-label">Total Actual Hours:</span>
              <span className="metric-value">{totalActual}h</span>
            </div>
            <div className="efficiency-item">
              <span className="metric-label">Time Saved:</span>
              <span className={`metric-value ${totalEstimated > totalActual ? 'positive' : 'negative'}`}>
                {Math.abs(totalEstimated - totalActual).toFixed(1)}h
                {totalEstimated > totalActual ? ' saved' : ' over'}
              </span>
            </div>
            <div className="efficiency-item">
              <span className="metric-label">Overall Efficiency:</span>
              <span className={`metric-value efficiency-${overallEfficiency >= 100 ? 'high' : overallEfficiency >= 80 ? 'medium' : 'low'}`}>
                {overallEfficiency.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard

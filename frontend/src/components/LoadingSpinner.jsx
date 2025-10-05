import React from 'react'

const LoadingSpinner = ({ size = 'medium', color = 'currentColor' }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size]

  return (
    <div className={`spinner ${sizeClass}`} style={{ borderTopColor: color }} />
  )
}

export default LoadingSpinner

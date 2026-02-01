function LoadingSpinner({ name }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">
        Searching 2,895 documents for <strong>"{name}"</strong>...
      </p>
      <div className="loading-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
      <p className="loading-hint">This may take a few seconds</p>
    </div>
  )
}

export default LoadingSpinner

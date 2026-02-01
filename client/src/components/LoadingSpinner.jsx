function LoadingSpinner({ name }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">
        Durchsuche 2.895 Dokumente nach <strong>"{name}"</strong>...
      </p>
      <div className="loading-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
      <p className="loading-hint">Dies kann einige Sekunden dauern</p>
    </div>
  )
}

export default LoadingSpinner

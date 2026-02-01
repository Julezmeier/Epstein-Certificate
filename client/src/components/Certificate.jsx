import { useState } from 'react'
import axios from 'axios'

function Certificate({ name }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingImage, setDownloadingImage] = useState(false)
  const [error, setError] = useState(null)

  const downloadFile = async (type) => {
    const isImage = type === 'image'
    const setDownloading = isImage ? setDownloadingImage : setDownloadingPdf

    setDownloading(true)
    setError(null)

    try {
      const response = await axios.post(
        `/api/certificate/${type}`,
        { name },
        { responseType: 'blob' }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      const sanitizedName = name
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50)

      link.setAttribute(
        'download',
        `Clearance_Certificate_${sanitizedName}.${isImage ? 'png' : 'pdf'}`
      )

      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Download error:', err)
      setError('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="certificate-section">
      <h3 className="certificate-title">Your Clearance Certificate</h3>

      <div className="certificate-preview">
        <div className="preview-badge">VERIFIED</div>
        <div className="preview-content">
          <p className="preview-header">CLEARANCE CERTIFICATE</p>
          <p className="preview-name">{name.toUpperCase()}</p>
          <p className="preview-text">was not found in any Epstein document</p>
          <div className="preview-checkmark">&#10003;</div>
        </div>
      </div>

      {error && (
        <p className="certificate-error">{error}</p>
      )}

      <div className="certificate-buttons">
        <button
          className="btn btn-primary btn-download"
          onClick={() => downloadFile('pdf')}
          disabled={downloadingPdf || downloadingImage}
        >
          {downloadingPdf ? (
            <span className="btn-loading">Generating...</span>
          ) : (
            <>
              <span className="btn-icon">&#128196;</span>
              Download PDF
            </>
          )}
        </button>

        <button
          className="btn btn-secondary btn-download"
          onClick={() => downloadFile('image')}
          disabled={downloadingPdf || downloadingImage}
        >
          {downloadingImage ? (
            <span className="btn-loading">Generating...</span>
          ) : (
            <>
              <span className="btn-icon">&#128247;</span>
              Image for Social Media
            </>
          )}
        </button>
      </div>

      <p className="certificate-hint">
        The image is optimized for Instagram, Twitter and other social media (1080x1080px).
      </p>
    </div>
  )
}

export default Certificate

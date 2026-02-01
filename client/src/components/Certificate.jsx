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

      // Erstelle Download-Link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      const sanitizedName = name
        .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50)

      link.setAttribute(
        'download',
        `Unbedenklichkeitszertifikat_${sanitizedName}.${isImage ? 'png' : 'pdf'}`
      )

      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Download-Fehler:', err)
      setError('Download fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="certificate-section">
      <h3 className="certificate-title">Ihr Unbedenklichkeitszertifikat</h3>

      <div className="certificate-preview">
        <div className="preview-badge">VERIFIZIERT</div>
        <div className="preview-content">
          <p className="preview-header">UNBEDENKLICHKEITSZERTIFIKAT</p>
          <p className="preview-name">{name.toUpperCase()}</p>
          <p className="preview-text">wurde in keinem Epstein-Dokument gefunden</p>
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
            <span className="btn-loading">Generiere...</span>
          ) : (
            <>
              <span className="btn-icon">&#128196;</span>
              PDF herunterladen
            </>
          )}
        </button>

        <button
          className="btn btn-secondary btn-download"
          onClick={() => downloadFile('image')}
          disabled={downloadingPdf || downloadingImage}
        >
          {downloadingImage ? (
            <span className="btn-loading">Generiere...</span>
          ) : (
            <>
              <span className="btn-icon">&#128247;</span>
              Bild fuer Social Media
            </>
          )}
        </button>
      </div>

      <p className="certificate-hint">
        Das Bild ist optimiert fuer Instagram, Twitter und andere soziale Medien (1080x1080px).
      </p>
    </div>
  )
}

export default Certificate

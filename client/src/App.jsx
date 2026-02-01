import { useState } from 'react'
import SearchForm from './components/SearchForm'
import ResultDisplay from './components/ResultDisplay'
import Certificate from './components/Certificate'
import LoadingSpinner from './components/LoadingSpinner'
import axios from 'axios'

function App() {
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchedName, setSearchedName] = useState('')

  const handleSearch = async (name) => {
    setIsLoading(true)
    setError(null)
    setSearchResult(null)
    setSearchedName(name)

    try {
      const response = await axios.post('/api/search', { name })
      setSearchResult(response.data)
    } catch (err) {
      console.error('Suchfehler:', err)
      setError(
        err.response?.data?.details ||
        'Die Suche konnte nicht durchgefuehrt werden. Bitte versuchen Sie es spaeter erneut.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSearchResult(null)
    setError(null)
    setSearchedName('')
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="badge">SATIRISCHE WEB-APP</div>
          <h1 className="title">Epstein Files</h1>
          <h2 className="subtitle">Unbedenklichkeitszertifikat</h2>
          <p className="description">
            Durchsuchen Sie {(2895).toLocaleString('de-DE')} Dokumente aus dem Epstein-Archiv
            und erhalten Sie Ihr persoenliches Unbedenklichkeitszertifikat.
          </p>
        </header>

        <main className="main">
          {!searchResult && !isLoading && (
            <SearchForm onSearch={handleSearch} disabled={isLoading} />
          )}

          {isLoading && <LoadingSpinner name={searchedName} />}

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              <p>{error}</p>
              <button onClick={handleReset} className="btn btn-secondary">
                Erneut versuchen
              </button>
            </div>
          )}

          {searchResult && !isLoading && (
            <>
              <ResultDisplay result={searchResult} name={searchedName} />

              {!searchResult.found && (
                <Certificate name={searchedName} />
              )}

              <button onClick={handleReset} className="btn btn-secondary reset-btn">
                Neue Suche
              </button>
            </>
          )}
        </main>

        <footer className="footer">
          <p className="disclaimer">
            <strong>Disclaimer:</strong> Dies ist eine satirische Web-Anwendung ohne jegliche
            rechtliche Bedeutung. Die Suche erfolgt in oeffentlich zugaenglichen Dokumenten.
            Kein Name wird gespeichert oder protokolliert.
          </p>
          <p className="copyright">
            2026 - Satirisches Projekt
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

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
      console.error('Search error:', err)
      setError(
        err.response?.data?.details ||
        'Search could not be performed. Please try again later.'
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
          <div className="badge">SATIRICAL WEB APP</div>
          <h1 className="title">Epstein Files</h1>
          <h2 className="subtitle">Clearance Certificate</h2>
          <p className="description">
            Search through {(2895).toLocaleString('en-US')} documents from the Epstein Archive
            and receive your personal clearance certificate.
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
                Try again
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
                New Search
              </button>
            </>
          )}
        </main>

        <footer className="footer">
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This is a satirical web application with no legal
            significance. The search is performed on publicly available documents.
            No names are stored or logged.
          </p>
          <p className="copyright">
            2026 - Satirical Project
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

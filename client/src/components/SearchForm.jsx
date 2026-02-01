import { useState } from 'react'

function SearchForm({ onSearch, disabled }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      onSearch(name.trim())
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="name-input" className="input-label">
          Enter your name:
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First and last name"
          className="input-field"
          disabled={disabled}
          minLength={2}
          maxLength={100}
          autoFocus
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={disabled || name.trim().length < 2}
      >
        <span className="btn-icon">&#128269;</span>
        Search Documents
      </button>

      <p className="search-hint">
        The search checks all available Epstein documents for exact
        and similar name matches.
      </p>
    </form>
  )
}

export default SearchForm

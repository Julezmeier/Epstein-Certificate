function ResultDisplay({ result, name }) {
  if (result.found) {
    return (
      <div className="result result-found">
        <div className="result-icon result-icon-warning">!</div>
        <h3 className="result-title">Name Found</h3>
        <p className="result-name">{name}</p>
        <p className="result-text">
          was found in {result.matches?.length || 1} document(s).
        </p>

        {result.matches && result.matches.length > 0 && (
          <div className="matches-list">
            <h4>References found:</h4>
            {result.matches.map((match, index) => (
              <div key={index} className="match-item">
                <span className="match-doc">{match.document}</span>
                {match.excerpt && (
                  <p className="match-excerpt">"{match.excerpt}"</p>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="result-disclaimer">
          Note: A match does not automatically imply involvement.
          Names can appear in various contexts.
        </p>
      </div>
    )
  }

  return (
    <div className="result result-clean">
      <div className="result-icon result-icon-success">&#10003;</div>
      <h3 className="result-title">No Matches</h3>
      <p className="result-name">{name}</p>
      <p className="result-text">
        was not found in any of the {result.searchedDocuments?.toLocaleString('en-US') || '2,895'} searched
        documents.
      </p>
      <p className="result-congrats">
        Congratulations! You can now download your official
        clearance certificate.
      </p>
    </div>
  )
}

export default ResultDisplay

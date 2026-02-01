function ResultDisplay({ result, name }) {
  if (result.found) {
    return (
      <div className="result result-found">
        <div className="result-icon result-icon-warning">!</div>
        <h3 className="result-title">Name gefunden</h3>
        <p className="result-name">{name}</p>
        <p className="result-text">
          wurde in {result.matches?.length || 1} Dokument(en) gefunden.
        </p>

        {result.matches && result.matches.length > 0 && (
          <div className="matches-list">
            <h4>Gefundene Referenzen:</h4>
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
          Hinweis: Ein Treffer bedeutet nicht automatisch eine Verwicklung.
          Namen koennen in verschiedenen Kontexten erscheinen.
        </p>
      </div>
    )
  }

  return (
    <div className="result result-clean">
      <div className="result-icon result-icon-success">&#10003;</div>
      <h3 className="result-title">Keine Treffer</h3>
      <p className="result-name">{name}</p>
      <p className="result-text">
        wurde in keinem der {result.searchedDocuments?.toLocaleString('de-DE') || '2.895'} durchsuchten
        Dokumente gefunden.
      </p>
      <p className="result-congrats">
        Herzlichen Glueckwunsch! Sie koennen nun Ihr offizielles
        Unbedenklichkeitszertifikat herunterladen.
      </p>
    </div>
  )
}

export default ResultDisplay

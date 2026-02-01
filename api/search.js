const MOCK_DOCUMENTS_COUNT = 2895;

const KNOWN_NAMES = [
  'bill clinton',
  'donald trump',
  'prince andrew',
  'alan dershowitz',
  'leslie wexner',
  'ghislaine maxwell',
  'virginia giuffre',
  'jean luc brunel'
];

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Name ist erforderlich',
        details: 'Bitte geben Sie einen Namen ein'
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        error: 'Name zu kurz',
        details: 'Der Name muss mindestens 2 Zeichen lang sein'
      });
    }

    const normalizedName = trimmedName.toLowerCase();
    const isKnownName = KNOWN_NAMES.some(known =>
      normalizedName.includes(known) || known.includes(normalizedName)
    );

    if (isKnownName) {
      return res.status(200).json({
        success: true,
        query: trimmedName,
        found: true,
        matches: [
          {
            document: `document_${Math.floor(Math.random() * 1000)}.pdf`,
            excerpt: `...${trimmedName} wurde in Verbindung mit...`,
            page: Math.floor(Math.random() * 50) + 1,
            score: 0.85 + Math.random() * 0.15
          }
        ],
        searchedDocuments: MOCK_DOCUMENTS_COUNT,
        source: 'Epstein Document Archive'
      });
    }

    return res.status(200).json({
      success: true,
      query: trimmedName,
      found: false,
      matches: [],
      searchedDocuments: MOCK_DOCUMENTS_COUNT,
      source: 'Epstein Document Archive'
    });

  } catch (error) {
    console.error('Suchfehler:', error);
    return res.status(500).json({
      error: 'Suchfehler',
      details: 'Die Suche konnte nicht durchgefuehrt werden.'
    });
  }
}

import { Router } from 'express';
import { searchName, getDocumentCount } from '../services/epsteinApi.js';

const router = Router();

/**
 * POST /api/search
 * Durchsucht die Epstein-Dokumente nach einem Namen
 */
router.post('/', async (req, res) => {
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

    if (trimmedName.length > 100) {
      return res.status(400).json({
        error: 'Name zu lang',
        details: 'Der Name darf maximal 100 Zeichen lang sein'
      });
    }

    console.log(`Suche nach: "${trimmedName}"`);

    const result = await searchName(trimmedName);

    res.json({
      success: true,
      query: trimmedName,
      ...result
    });

  } catch (error) {
    console.error('Suchfehler:', error);
    res.status(500).json({
      error: 'Suchfehler',
      details: 'Die Suche konnte nicht durchgefuehrt werden. Bitte versuchen Sie es spaeter erneut.'
    });
  }
});

/**
 * GET /api/search/stats
 * Gibt Statistiken ueber die indexierten Dokumente zurueck
 */
router.get('/stats', (req, res) => {
  res.json({
    documentCount: getDocumentCount(),
    source: 'Epstein Document Archive',
    lastUpdated: '2026-01-15'
  });
});

export default router;

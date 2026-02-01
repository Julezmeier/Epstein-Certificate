import { Router } from 'express';
import { searchName, getDocumentCount } from '../services/epsteinApi.js';

const router = Router();

/**
 * POST /api/search
 * Search Epstein documents for a name
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Name required',
        details: 'Please enter a name'
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        error: 'Name too short',
        details: 'Name must be at least 2 characters long'
      });
    }

    if (trimmedName.length > 100) {
      return res.status(400).json({
        error: 'Name too long',
        details: 'Name must be at most 100 characters long'
      });
    }

    console.log(`Searching for: "${trimmedName}"`);

    const result = await searchName(trimmedName);

    res.json({
      success: true,
      query: trimmedName,
      ...result
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search error',
      details: 'Search could not be performed. Please try again later.'
    });
  }
});

/**
 * GET /api/search/stats
 * Returns statistics about indexed documents
 */
router.get('/stats', (req, res) => {
  res.json({
    documentCount: getDocumentCount(),
    source: 'Epstein Document Archive',
    lastUpdated: '2026-01-15'
  });
});

export default router;

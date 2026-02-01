import express from 'express';
import cors from 'cors';
import { searchName, getDocumentCount } from '../server/src/services/epsteinApi.js';
import { generateCertificatePDF } from '../server/src/services/pdfGenerator.js';
import { generateCertificateImage } from '../server/src/services/imageGenerator.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Search endpoint
app.post('/api/search', async (req, res) => {
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

// Stats endpoint
app.get('/api/search/stats', (req, res) => {
  res.json({
    documentCount: getDocumentCount(),
    source: 'Epstein Document Archive',
    lastUpdated: '2026-01-15'
  });
});

// PDF Certificate endpoint
app.post('/api/certificate/pdf', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid name',
        details: 'Please enter a valid name'
      });
    }

    const trimmedName = name.trim();
    console.log(`Generating PDF certificate for: "${trimmedName}"`);

    const pdfBuffer = await generateCertificatePDF(trimmedName);

    const filename = `epstein-clearance-${trimmedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      error: 'Generation error',
      details: 'Certificate could not be generated. Please try again later.'
    });
  }
});

// Image Certificate endpoint
app.post('/api/certificate/image', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid name',
        details: 'Please enter a valid name'
      });
    }

    const trimmedName = name.trim();
    console.log(`Generating image certificate for: "${trimmedName}"`);

    const imageBuffer = await generateCertificateImage(trimmedName);

    const filename = `epstein-clearance-${trimmedName.toLowerCase().replace(/\s+/g, '-')}.png`;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', imageBuffer.length);

    res.send(imageBuffer);

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: 'Generation error',
      details: 'Certificate could not be generated. Please try again later.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;

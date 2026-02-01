import { Router } from 'express';
import { generateCertificatePDF } from '../services/pdfGenerator.js';
import { generateCertificateImage } from '../services/imageGenerator.js';
import { getDocumentCount } from '../services/epsteinApi.js';

const router = Router();

/**
 * POST /api/certificate/pdf
 * Generiert ein Unbedenklichkeitszertifikat als PDF
 */
router.post('/pdf', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Ungueltiger Name',
        details: 'Bitte geben Sie einen gueltigen Namen ein'
      });
    }

    const trimmedName = name.trim();
    const documentCount = getDocumentCount();

    console.log(`Generiere PDF-Zertifikat fuer: "${trimmedName}"`);

    const pdfBuffer = await generateCertificatePDF(trimmedName, documentCount);

    // Dateiname fuer Download
    const sanitizedName = trimmedName
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Unbedenklichkeitszertifikat_${sanitizedName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF-Generierungsfehler:', error);
    res.status(500).json({
      error: 'PDF-Generierungsfehler',
      details: 'Das Zertifikat konnte nicht erstellt werden'
    });
  }
});

/**
 * POST /api/certificate/image
 * Generiert ein Unbedenklichkeitszertifikat als PNG-Bild
 */
router.post('/image', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Ungueltiger Name',
        details: 'Bitte geben Sie einen gueltigen Namen ein'
      });
    }

    const trimmedName = name.trim();
    const documentCount = getDocumentCount();

    console.log(`Generiere Bild-Zertifikat fuer: "${trimmedName}"`);

    const imageBuffer = await generateCertificateImage(trimmedName, documentCount);

    // Dateiname fuer Download
    const sanitizedName = trimmedName
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="Unbedenklichkeitszertifikat_${sanitizedName}.png"`);
    res.setHeader('Content-Length', imageBuffer.length);

    res.send(imageBuffer);

  } catch (error) {
    console.error('Bild-Generierungsfehler:', error);
    res.status(500).json({
      error: 'Bild-Generierungsfehler',
      details: 'Das Zertifikat konnte nicht erstellt werden'
    });
  }
});

export default router;

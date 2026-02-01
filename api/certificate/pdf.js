import PDFDocument from 'pdfkit';
import crypto from 'crypto';

export default async function handler(req, res) {
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

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Ungueltiger Name',
        details: 'Bitte geben Sie einen gueltigen Namen ein'
      });
    }

    const trimmedName = name.trim();
    const documentCount = 2895;

    const pdfBuffer = await generateCertificatePDF(trimmedName, documentCount);

    const sanitizedName = trimmedName
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Unbedenklichkeitszertifikat_${sanitizedName}.pdf"`);

    return res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF-Generierungsfehler:', error);
    return res.status(500).json({
      error: 'PDF-Generierungsfehler',
      details: 'Das Zertifikat konnte nicht erstellt werden'
    });
  }
}

async function generateCertificatePDF(name, documentCount) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;
      const date = new Date().toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const verificationCode = crypto
        .createHash('sha256')
        .update(`${name}-${date}-epstein-cert`)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();

      // Hintergrund
      doc.rect(0, 0, width, height).fill('#FDF8F0');

      // Goldener Rahmen
      const borderMargin = 30;
      doc.lineWidth(3)
        .strokeColor('#C9A227')
        .rect(borderMargin, borderMargin, width - 2 * borderMargin, height - 2 * borderMargin)
        .stroke();

      doc.lineWidth(1)
        .strokeColor('#C9A227')
        .rect(borderMargin + 10, borderMargin + 10, width - 2 * borderMargin - 20, height - 2 * borderMargin - 20)
        .stroke();

      // Header
      doc.fillColor('#1a1a2e')
        .fontSize(16)
        .font('Helvetica')
        .text('BUNDESREPUBLIK SATIRE', 0, 70, { align: 'center' });

      // Haupttitel
      doc.fillColor('#C9A227')
        .fontSize(42)
        .font('Helvetica-Bold')
        .text('UNBEDENKLICHKEITSZERTIFIKAT', 0, 100, { align: 'center' });

      // Untertitel
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text('Epstein Document Archive - Offizielles Suchergebnis', 0, 155, { align: 'center' });

      // Trennlinie
      doc.strokeColor('#C9A227')
        .lineWidth(1)
        .moveTo(150, 180)
        .lineTo(width - 150, 180)
        .stroke();

      // Haupttext
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text('Hiermit wird offiziell bestaetigt, dass der Name', 0, 210, { align: 'center' });

      // Name
      doc.fillColor('#1a1a2e')
        .fontSize(36)
        .font('Helvetica-Bold')
        .text(name.toUpperCase(), 0, 240, { align: 'center' });

      // Weiterer Text
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text(`in keinem der ${documentCount.toLocaleString('de-DE')} durchsuchten Epstein-Dokumente`, 0, 290, { align: 'center' })
        .text('gefunden wurde.', 0, 310, { align: 'center' });

      // Datum
      doc.fontSize(12)
        .text(`Ausgestellt am: ${date}`, 0, 350, { align: 'center' });

      // Siegel
      const sealX = width - 150;
      const sealY = height - 150;
      const sealRadius = 50;

      doc.circle(sealX, sealY, sealRadius)
        .lineWidth(2)
        .strokeColor('#C9A227')
        .stroke();

      doc.circle(sealX, sealY, sealRadius - 5)
        .lineWidth(1)
        .strokeColor('#C9A227')
        .stroke();

      doc.fillColor('#C9A227')
        .fontSize(8)
        .text('VERIFIZIERT', sealX - 25, sealY - 20, { width: 50, align: 'center' })
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('CLEAN', sealX - 25, sealY - 5, { width: 50, align: 'center' })
        .fontSize(8)
        .font('Helvetica')
        .text('2026', sealX - 25, sealY + 10, { width: 50, align: 'center' });

      // Verifizierungscode
      doc.fillColor('#666')
        .fontSize(10)
        .font('Helvetica')
        .text(`Verifizierungscode: ${verificationCode}`, 0, height - 100, { align: 'center' });

      // Disclaimer
      doc.fillColor('#999')
        .fontSize(8)
        .text('DISCLAIMER: Dies ist eine satirische Web-Anwendung ohne jegliche rechtliche Bedeutung.', 0, height - 80, { align: 'center' })
        .text('Das Zertifikat dient ausschliesslich Unterhaltungszwecken und stellt keine offizielle Bestaetigung dar.', 0, height - 68, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

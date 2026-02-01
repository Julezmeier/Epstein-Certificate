import PDFDocument from 'pdfkit';
import crypto from 'crypto';

/**
 * Generiert ein Unbedenklichkeitszertifikat als PDF
 * @param {string} name - Name der Person
 * @param {number} documentCount - Anzahl durchsuchter Dokumente
 * @returns {Promise<Buffer>} PDF als Buffer
 */
export async function generateCertificatePDF(name, documentCount = 2895) {
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

      // Verifizierungscode generieren
      const verificationCode = crypto
        .createHash('sha256')
        .update(`${name}-${date}-epstein-cert`)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();

      // Hintergrund (leichtes Beige)
      doc.rect(0, 0, width, height).fill('#FDF8F0');

      // Goldener Rahmen
      const borderMargin = 30;
      doc.lineWidth(3)
        .strokeColor('#C9A227')
        .rect(borderMargin, borderMargin, width - 2 * borderMargin, height - 2 * borderMargin)
        .stroke();

      // Innerer Rahmen
      doc.lineWidth(1)
        .strokeColor('#C9A227')
        .rect(borderMargin + 10, borderMargin + 10, width - 2 * borderMargin - 20, height - 2 * borderMargin - 20)
        .stroke();

      // Dekorative Ecken
      const cornerSize = 20;
      const corners = [
        [borderMargin + 5, borderMargin + 5],
        [width - borderMargin - 5 - cornerSize, borderMargin + 5],
        [borderMargin + 5, height - borderMargin - 5 - cornerSize],
        [width - borderMargin - 5 - cornerSize, height - borderMargin - 5 - cornerSize]
      ];

      corners.forEach(([x, y]) => {
        doc.lineWidth(2)
          .strokeColor('#C9A227')
          .moveTo(x, y + cornerSize)
          .lineTo(x, y)
          .lineTo(x + cornerSize, y)
          .stroke();
      });

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

      // Name (gross und prominent)
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

      // Siegel (Kreis mit Text)
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

import PDFDocument from 'pdfkit';
import crypto from 'crypto';

/**
 * Generate a clearance certificate as PDF
 * @param {string} name - Person's name
 * @param {number} documentCount - Number of searched documents
 * @returns {Promise<Buffer>} PDF as Buffer
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
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate verification code
      const verificationCode = crypto
        .createHash('sha256')
        .update(`${name}-${date}-epstein-cert`)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();

      // Background (light beige)
      doc.rect(0, 0, width, height).fill('#FDF8F0');

      // Gold border
      const borderMargin = 30;
      doc.lineWidth(3)
        .strokeColor('#C9A227')
        .rect(borderMargin, borderMargin, width - 2 * borderMargin, height - 2 * borderMargin)
        .stroke();

      // Inner border
      doc.lineWidth(1)
        .strokeColor('#C9A227')
        .rect(borderMargin + 10, borderMargin + 10, width - 2 * borderMargin - 20, height - 2 * borderMargin - 20)
        .stroke();

      // Decorative corners (L-shapes pointing inward)
      const cornerSize = 25;
      const cornerOffset = borderMargin + 8;

      // Top-left corner (pointing inward to bottom-right)
      doc.lineWidth(2)
        .strokeColor('#C9A227')
        .moveTo(cornerOffset, cornerOffset + cornerSize)
        .lineTo(cornerOffset, cornerOffset)
        .lineTo(cornerOffset + cornerSize, cornerOffset)
        .stroke();

      // Top-right corner (pointing inward to bottom-left)
      doc.moveTo(width - cornerOffset, cornerOffset + cornerSize)
        .lineTo(width - cornerOffset, cornerOffset)
        .lineTo(width - cornerOffset - cornerSize, cornerOffset)
        .stroke();

      // Bottom-left corner (pointing inward to top-right)
      doc.moveTo(cornerOffset, height - cornerOffset - cornerSize)
        .lineTo(cornerOffset, height - cornerOffset)
        .lineTo(cornerOffset + cornerSize, height - cornerOffset)
        .stroke();

      // Bottom-right corner (pointing inward to top-left)
      doc.moveTo(width - cornerOffset, height - cornerOffset - cornerSize)
        .lineTo(width - cornerOffset, height - cornerOffset)
        .lineTo(width - cornerOffset - cornerSize, height - cornerOffset)
        .stroke();

      // Calculate center Y position for content
      const contentStartY = 60;

      // Header
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text('REPUBLIC OF SATIRE', 0, contentStartY, { align: 'center' });

      // Main title
      doc.fillColor('#C9A227')
        .fontSize(38)
        .font('Helvetica-Bold')
        .text('CLEARANCE CERTIFICATE', 0, contentStartY + 25, { align: 'center' });

      // Subtitle
      doc.fillColor('#1a1a2e')
        .fontSize(12)
        .font('Helvetica')
        .text('Epstein Document Archive - Official Search Result', 0, contentStartY + 75, { align: 'center' });

      // Divider line
      doc.strokeColor('#C9A227')
        .lineWidth(1)
        .moveTo(180, contentStartY + 100)
        .lineTo(width - 180, contentStartY + 100)
        .stroke();

      // Main text
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text('This is to officially certify that the name', 0, contentStartY + 130, { align: 'center' });

      // Name (large and prominent)
      doc.fillColor('#1a1a2e')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text(name.toUpperCase(), 0, contentStartY + 160, { align: 'center' });

      // Additional text
      doc.fillColor('#1a1a2e')
        .fontSize(14)
        .font('Helvetica')
        .text(`was not found in any of the ${documentCount.toLocaleString('en-US')} searched Epstein documents.`, 0, contentStartY + 210, { align: 'center' });

      // Date
      doc.fontSize(12)
        .text(`Issued on: ${date}`, 0, contentStartY + 250, { align: 'center' });

      // Green checkmark circle in center
      const checkX = width / 2;
      const checkY = contentStartY + 320;
      const checkRadius = 30;

      // Green circle background
      doc.circle(checkX, checkY, checkRadius)
        .fill('#4CAF50');

      // White checkmark
      doc.strokeColor('#FFFFFF')
        .lineWidth(4)
        .lineCap('round')
        .lineJoin('round')
        .moveTo(checkX - 12, checkY)
        .lineTo(checkX - 3, checkY + 10)
        .lineTo(checkX + 15, checkY - 10)
        .stroke();

      // Seal (circle with text)
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
        .text('VERIFIED', sealX - 25, sealY - 20, { width: 50, align: 'center' })
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('CLEAN', sealX - 25, sealY - 5, { width: 50, align: 'center' })
        .fontSize(8)
        .font('Helvetica')
        .text('2026', sealX - 25, sealY + 10, { width: 50, align: 'center' });

      // Verification code
      doc.fillColor('#666')
        .fontSize(10)
        .font('Helvetica')
        .text(`Verification Code: ${verificationCode}`, 0, height - 100, { align: 'center' });

      // Disclaimer
      doc.fillColor('#999')
        .fontSize(8)
        .text('DISCLAIMER: This is a satirical web application with no legal significance.', 0, height - 80, { align: 'center' })
        .text('This certificate is for entertainment purposes only and does not constitute official confirmation.', 0, height - 68, { align: 'center' });

      // Watermark - diagonal across document
      doc.save();
      doc.rotate(-30, { origin: [width / 2, height / 2] });
      doc.fillColor('#000')
        .opacity(0.04)
        .fontSize(50)
        .font('Helvetica-Bold')
        .text('epstein-certificate.xyz', width / 2 - 200, height / 2 - 20);
      doc.restore();

      // Small watermark bottom right
      doc.fillColor('#C9A227')
        .opacity(0.5)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('epstein-certificate.xyz', width - 180, height - 55);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

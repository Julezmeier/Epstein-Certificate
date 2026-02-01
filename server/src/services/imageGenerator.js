import { createCanvas } from '@napi-rs/canvas';
import crypto from 'crypto';

/**
 * Generate a clearance certificate as PNG image
 * Uses @napi-rs/canvas for reliable text rendering on Vercel
 * @param {string} name - Person's name
 * @param {number} documentCount - Number of searched documents
 * @returns {Promise<Buffer>} PNG as Buffer
 */
export async function generateCertificateImage(name, documentCount = 2895) {
  const width = 1080;
  const height = 1080;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Verification code
  const verificationCode = crypto
    .createHash('sha256')
    .update(`${name}-${date}-epstein-cert`)
    .digest('hex')
    .substring(0, 12)
    .toUpperCase();

  // Prepare display name
  let displayName = name.toUpperCase();
  if (displayName.length > 25) {
    displayName = displayName.substring(0, 22) + '...';
  }

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = '#C9A227';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner border
  ctx.lineWidth = 1;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner decorations (L-shapes pointing inward)
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#C9A227';

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(50, 80);
  ctx.lineTo(50, 50);
  ctx.lineTo(80, 50);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - 50, 80);
  ctx.lineTo(width - 50, 50);
  ctx.lineTo(width - 80, 50);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(50, height - 80);
  ctx.lineTo(50, height - 50);
  ctx.lineTo(80, height - 50);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - 50, height - 80);
  ctx.lineTo(width - 50, height - 50);
  ctx.lineTo(width - 80, height - 50);
  ctx.stroke();

  // Star badge
  drawStar(ctx, width / 2, 115, 40, 5, '#C9A227');

  // Header text
  ctx.fillStyle = '#C9A227';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REPUBLIC OF SATIRE', width / 2, 210);

  // Main title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText('CLEARANCE', width / 2, 290);
  ctx.fillText('CERTIFICATE', width / 2, 350);

  // Gold line
  ctx.strokeStyle = '#C9A227';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 390);
  ctx.lineTo(width - 200, 390);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#888888';
  ctx.font = '16px sans-serif';
  ctx.fillText('Epstein Document Archive', width / 2, 430);

  // Confirmation text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px sans-serif';
  ctx.fillText('This is to certify that the name', width / 2, 500);

  // Name
  const nameFontSize = displayName.length > 18 ? 42 : 56;
  ctx.fillStyle = '#C9A227';
  ctx.font = `bold ${nameFontSize}px sans-serif`;
  ctx.fillText(displayName, width / 2, 580);

  // More text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px sans-serif';
  ctx.fillText(`was not found in any of the ${documentCount.toLocaleString('en-US')}`, width / 2, 650);
  ctx.fillText('searched Epstein documents.', width / 2, 680);

  // Checkmark circle
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(width / 2, 760, 40, 0, Math.PI * 2);
  ctx.fill();

  // Checkmark
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 18, 760);
  ctx.lineTo(width / 2 - 5, 775);
  ctx.lineTo(width / 2 + 20, 745);
  ctx.stroke();

  // Verified text
  ctx.fillStyle = '#4CAF50';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('VERIFIED CLEAN', width / 2, 840);

  // Date and code
  ctx.fillStyle = '#888888';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Issued: ${date}`, width / 2, 900);
  ctx.fillText(`Code: ${verificationCode}`, width / 2, 925);

  // Disclaimer
  ctx.fillStyle = '#555555';
  ctx.font = '11px sans-serif';
  ctx.fillText('SATIRICAL WEB APP - NO LEGAL SIGNIFICANCE', width / 2, 990);
  ctx.fillText('epstein-certificate.com', width / 2, 1010);

  // Diagonal watermark
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-30 * Math.PI / 180);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.font = 'bold 60px sans-serif';
  ctx.fillText('epstein-certificate.com', 0, 0);
  ctx.restore();

  // Small watermark bottom right
  ctx.fillStyle = 'rgba(201, 162, 39, 0.6)';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('epstein-certificate.com', width - 60, height - 55);

  return canvas.toBuffer('image/png');
}

/**
 * Draw a 5-pointed star
 */
function drawStar(ctx, cx, cy, outerRadius, points, color) {
  const innerRadius = outerRadius * 0.4;
  const step = Math.PI / points;

  ctx.beginPath();
  ctx.fillStyle = color;

  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
}

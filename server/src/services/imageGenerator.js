import sharp from 'sharp';
import crypto from 'crypto';

/**
 * Generiert ein Unbedenklichkeitszertifikat als PNG-Bild
 * Verwendet SVG → PNG Konvertierung mit sharp
 * @param {string} name - Name der Person
 * @param {number} documentCount - Anzahl durchsuchter Dokumente
 * @returns {Promise<Buffer>} PNG als Buffer
 */
export async function generateCertificateImage(name, documentCount = 2895) {
  const width = 1080;
  const height = 1080;

  const date = new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Verifizierungscode
  const verificationCode = crypto
    .createHash('sha256')
    .update(`${name}-${date}-epstein-cert`)
    .digest('hex')
    .substring(0, 12)
    .toUpperCase();

  // Escape HTML-Sonderzeichen im Namen
  const escapedName = name
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .toUpperCase();

  // Name kuerzen wenn zu lang
  const displayName = escapedName.length > 25
    ? escapedName.substring(0, 22) + '...'
    : escapedName;

  // Schriftgroesse anpassen
  const nameFontSize = displayName.length > 18 ? 42 : 56;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e"/>
          <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>

      <!-- Outer Border -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}"
            fill="none" stroke="#C9A227" stroke-width="4"/>

      <!-- Inner Border -->
      <rect x="55" y="55" width="${width - 110}" height="${height - 110}"
            fill="none" stroke="#C9A227" stroke-width="1"/>

      <!-- Corner Decorations -->
      <path d="M50 80 L50 50 L80 50" fill="none" stroke="#C9A227" stroke-width="3"/>
      <path d="M${width - 50} 80 L${width - 50} 50 L${width - 80} 50" fill="none" stroke="#C9A227" stroke-width="3"/>
      <path d="M50 ${height - 80} L50 ${height - 50} L80 ${height - 50}" fill="none" stroke="#C9A227" stroke-width="3"/>
      <path d="M${width - 50} ${height - 80} L${width - 50} ${height - 50} L${width - 80} ${height - 50}" fill="none" stroke="#C9A227" stroke-width="3"/>

      <!-- Star Badge -->
      <polygon points="540,85 552,115 578,115 558,135 566,160 540,145 514,160 522,135 502,115 528,115"
               fill="#C9A227"/>

      <!-- Header Text -->
      <text x="${width / 2}" y="210" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="18" font-weight="bold"
            fill="#C9A227" letter-spacing="3">BUNDESREPUBLIK SATIRE</text>

      <!-- Main Title -->
      <text x="${width / 2}" y="290" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="#FFFFFF">UNBEDENKLICHKEITS-</text>
      <text x="${width / 2}" y="350" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="#FFFFFF">ZERTIFIKAT</text>

      <!-- Gold Line -->
      <line x1="200" y1="390" x2="${width - 200}" y2="390"
            stroke="#C9A227" stroke-width="2"/>

      <!-- Subtitle -->
      <text x="${width / 2}" y="430" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="16"
            fill="#888888">Epstein Document Archive</text>

      <!-- Confirmation Text -->
      <text x="${width / 2}" y="500" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="20"
            fill="#FFFFFF">Hiermit wird bestaetigt, dass der Name</text>

      <!-- Name -->
      <text x="${width / 2}" y="580" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="${nameFontSize}" font-weight="bold"
            fill="#C9A227">${displayName}</text>

      <!-- More Text -->
      <text x="${width / 2}" y="650" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="20"
            fill="#FFFFFF">in keinem der ${documentCount.toLocaleString('de-DE')} durchsuchten</text>
      <text x="${width / 2}" y="680" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="20"
            fill="#FFFFFF">Epstein-Dokumente gefunden wurde.</text>

      <!-- Checkmark Circle -->
      <circle cx="${width / 2}" cy="760" r="40" fill="#4CAF50"/>
      <polyline points="522,760 535,775 560,745"
            fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Verified Text -->
      <text x="${width / 2}" y="840" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="24" font-weight="bold"
            fill="#4CAF50">VERIFIZIERT CLEAN</text>

      <!-- Date and Code -->
      <text x="${width / 2}" y="900" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="14"
            fill="#888888">Ausgestellt: ${date}</text>
      <text x="${width / 2}" y="925" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="14"
            fill="#888888">Code: ${verificationCode}</text>

      <!-- Disclaimer -->
      <text x="${width / 2}" y="990" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="11"
            fill="#555555">SATIRISCHE WEB-APP - KEINE RECHTLICHE BEDEUTUNG</text>
      <text x="${width / 2}" y="1010" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="11"
            fill="#555555">epstein-certificate.app</text>
    </svg>
  `;

  // Konvertiere SVG zu PNG
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return pngBuffer;
}

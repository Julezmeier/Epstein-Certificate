import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import crypto from 'crypto';

// Fetch font from Google Fonts CDN (works reliably on Vercel)
async function loadFont() {
  const response = await fetch(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  );
  return await response.arrayBuffer();
}

/**
 * Generate a clearance certificate as PNG image
 * Uses satori + resvg for reliable rendering on Vercel
 * @param {string} name - Person's name
 * @param {number} documentCount - Number of searched documents
 * @returns {Promise<Buffer>} PNG as Buffer
 */
export async function generateCertificateImage(name, documentCount = 2895) {
  const width = 1080;
  const height = 1080;

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

  const nameFontSize = displayName.length > 18 ? 42 : 56;

  // Load font
  const fontData = await loadFont();

  // Create the certificate as React-like JSX structure
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          fontFamily: 'Inter',
          position: 'relative',
          padding: '40px',
        },
        children: [
          // Outer border
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 40,
                left: 40,
                right: 40,
                bottom: 40,
                border: '4px solid #C9A227',
              },
            },
          },
          // Inner border
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 55,
                left: 55,
                right: 55,
                bottom: 55,
                border: '1px solid #C9A227',
              },
            },
          },
          // Star
          {
            type: 'div',
            props: {
              style: {
                fontSize: 60,
                marginTop: 30,
                color: '#C9A227',
              },
              children: '★',
            },
          },
          // Header
          {
            type: 'div',
            props: {
              style: {
                fontSize: 18,
                fontWeight: 700,
                color: '#C9A227',
                letterSpacing: 3,
                marginTop: 30,
              },
              children: 'REPUBLIC OF SATIRE',
            },
          },
          // Main title
          {
            type: 'div',
            props: {
              style: {
                fontSize: 48,
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: 20,
              },
              children: 'CLEARANCE',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 48,
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: -5,
              },
              children: 'CERTIFICATE',
            },
          },
          // Gold line
          {
            type: 'div',
            props: {
              style: {
                width: 680,
                height: 2,
                backgroundColor: '#C9A227',
                marginTop: 25,
              },
            },
          },
          // Subtitle
          {
            type: 'div',
            props: {
              style: {
                fontSize: 16,
                color: '#888888',
                marginTop: 20,
              },
              children: 'Epstein Document Archive',
            },
          },
          // Confirmation text
          {
            type: 'div',
            props: {
              style: {
                fontSize: 20,
                color: '#FFFFFF',
                marginTop: 40,
              },
              children: 'This is to certify that the name',
            },
          },
          // Name
          {
            type: 'div',
            props: {
              style: {
                fontSize: nameFontSize,
                fontWeight: 700,
                color: '#C9A227',
                marginTop: 20,
              },
              children: displayName,
            },
          },
          // More text
          {
            type: 'div',
            props: {
              style: {
                fontSize: 20,
                color: '#FFFFFF',
                marginTop: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    children: `was not found in any of the ${documentCount.toLocaleString('en-US')}`,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { marginTop: 5 },
                    children: 'searched Epstein documents.',
                  },
                },
              ],
            },
          },
          // Checkmark circle
          {
            type: 'div',
            props: {
              style: {
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
                fontSize: 40,
                color: '#FFFFFF',
              },
              children: '✓',
            },
          },
          // Verified text
          {
            type: 'div',
            props: {
              style: {
                fontSize: 24,
                fontWeight: 700,
                color: '#4CAF50',
                marginTop: 15,
              },
              children: 'VERIFIED CLEAN',
            },
          },
          // Date and code
          {
            type: 'div',
            props: {
              style: {
                fontSize: 14,
                color: '#888888',
                marginTop: 30,
              },
              children: `Issued: ${date}`,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 14,
                color: '#888888',
                marginTop: 5,
              },
              children: `Code: ${verificationCode}`,
            },
          },
          // Disclaimer
          {
            type: 'div',
            props: {
              style: {
                fontSize: 11,
                color: '#555555',
                marginTop: 40,
              },
              children: 'SATIRICAL WEB APP - NO LEGAL SIGNIFICANCE',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 11,
                color: '#555555',
                marginTop: 3,
              },
              children: 'epstein-certificate.xyz',
            },
          },
          // Watermark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 55,
                right: 60,
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(201, 162, 39, 0.6)',
              },
              children: 'epstein-certificate.xyz',
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // Convert SVG to PNG
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import searchRoutes from './routes/search.js';
import certificateRoutes from './routes/certificate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/certificate', certificateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from client build
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

app.listen(PORT, () => {
  console.log(`Server laeuft auf http://localhost:${PORT}`);
});

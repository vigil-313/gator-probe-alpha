/**
 * VALUGATOR Probe Alpha Server
 * Main entry point for the application
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import will be implemented in future tasks
// import { configLoader } from './config/index.js';
// import { promptAssembler } from './prompt/index.js';
// import { apiClient } from './api/index.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route - simple UI for submitting ideas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for gator response (to be implemented in future tasks)
app.post('/api/gator', (req, res) => {
  res.status(501).json({ message: 'Gator API not yet implemented' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', version: '0.1.0' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`VALUGATOR Probe Alpha server running on port ${PORT}`);
  });
}

export default app; // Export for testing
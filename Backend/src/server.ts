import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development origins or no origin (like curl/mobile)
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// API Routes
app.use('/api/v1', routes);

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Marshrut topilmadi: ${req.method} ${req.originalUrl}`,
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    name: 'CodeHub API Server',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Error handling
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`\n🚀 CodeHub Backend API Server muvaffaqiyatli ishga tushdi:`);
  console.log(`   - URL: http://localhost:${config.port}`);
  console.log(`   - Health check: http://localhost:${config.port}/api/v1/health`);
  console.log(`   - Uploads: http://localhost:${config.port}/uploads\n`);
});

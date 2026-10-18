import 'dotenv/config'; // MUST be the first import
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from '@codehub/shared/backend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveUploadsPath(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }
  let currentDir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(currentDir, 'uploads');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  return path.resolve(process.cwd(), 'uploads');
}

const app = express();
const uploadsPath = resolveUploadsPath();

// CORS for admin-panel
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || config.clientUrls.includes(origin) || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads static serving
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Marshrut topilmadi: ${req.method} ${req.originalUrl}`,
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'CodeHub Admin Panel Backend API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n🚀 CodeHub Admin Panel Backend muvaffaqiyatli ishga tushdi:`);
  console.log(`   - URL: http://localhost:${config.port}`);
  console.log(`   - Health check: http://localhost:${config.port}/api/v1/health`);
  console.log(`   - Uploads: http://localhost:${config.port}/uploads\n`);
});

export default app;

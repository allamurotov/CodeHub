import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_BASE = path.resolve(__dirname, '../../uploads');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'materials';
    if (file.fieldname === 'cover') {
      folder = 'covers';
    } else if (file.fieldname === 'video') {
      folder = 'videos';
    }
    const targetDir = path.join(UPLOAD_BASE, folder);
    ensureDir(targetDir);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max limit
  },
});

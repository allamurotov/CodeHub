import dotenv from 'dotenv';

dotenv.config();

const clientUrls = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((u) => u.trim());

export const config = {
  port: Number(process.env.PORT) || 4001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrls,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'codehub_super_secret_access_jwt_key_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'codehub_super_secret_refresh_jwt_key_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};

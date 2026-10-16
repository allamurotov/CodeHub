import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthTokenPayload } from '../types';

export function signAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as AuthTokenPayload;
  } catch {
    return null;
  }
}

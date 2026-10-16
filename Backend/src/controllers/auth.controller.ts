import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { User } from '../types';

function cleanUser(user: User) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, "Barcha maydonlarni to'ldiring", 400);
  }

  const existing = db.users.findByEmail(email);
  if (existing) {
    return errorResponse(res, 'Bu email manzil allaqachon ro\'yxatdan o\'tgan', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: User = {
    id: `usr_${uuidv4()}`,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'USER',
    permissions: [],
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  db.users.create(newUser);

  const tokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    permissions: newUser.permissions,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  db.refreshTokens.save(newUser.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return successResponse(
    res,
    "Ro'yxatdan muvaffaqiyatli o'tdingiz",
    {
      user: cleanUser(newUser),
      accessToken,
      refreshToken,
    },
    201
  );
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Email va parolni kiriting', 400);
  }

  const user = db.users.findByEmail(email);
  if (!user) {
    return errorResponse(res, 'Email yoki parol noto\'g\'ri', 401);
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return errorResponse(res, 'Email yoki parol noto\'g\'ri', 401);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  db.refreshTokens.save(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return successResponse(res, 'Tizimga muvaffaqiyatli kirdingiz', {
    user: cleanUser(user),
    accessToken,
    refreshToken,
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, 'Refresh token taqdim etilmadi', 400);
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return errorResponse(res, 'Yaroqsiz yoki muddati o\'tgan refresh token', 401);
  }

  const saved = db.refreshTokens.find(refreshToken);
  if (!saved) {
    return errorResponse(res, 'Refresh token bekor qilingan', 401);
  }

  const user = db.users.findById(payload.userId);
  if (!user) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  db.refreshTokens.remove(refreshToken);
  db.refreshTokens.save(user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return successResponse(res, 'Token muvaffaqiyatli yangilandi', {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}

export async function profile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return errorResponse(res, 'Avtorizatsiyadan o\'ting', 401);
  }

  const user = db.users.findById(req.user.userId);
  if (!user) {
    return errorResponse(res, 'Foydalanuvchi topilmadi', 404);
  }

  return successResponse(res, 'Profil ma\'lumotlari', cleanUser(user));
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.refreshTokens.remove(refreshToken);
  }
  return successResponse(res, 'Tizimdan muvaffaqiyatli chiqildi');
}

export async function oauthHandler(req: Request, res: Response) {
  const provider = req.params.provider || 'Google';
  const email = `${provider.toLowerCase()}user@codehub.uz`;
  let user = db.users.findByEmail(email);

  if (!user) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('oauth_pass_123', salt);
    user = {
      id: `usr_${uuidv4()}`,
      name: `${provider} Foydalanuvchisi`,
      email,
      passwordHash,
      role: 'USER',
      permissions: [],
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    db.users.create(user);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Return HTML that posts the message to opener and closes popup
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>${provider} Authentication</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:50px;">
        <h3>Muvaffaqiyatli tasdiqlandi!</h3>
        <p>Iltimos kuting, oyna avtomatik yopiladi...</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: "OAUTH_SUCCESS",
              accessToken: "${accessToken}",
              refreshToken: "${refreshToken}"
            }, "*");
          }
          setTimeout(() => window.close(), 600);
        </script>
      </body>
    </html>
  `);
}

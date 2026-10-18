import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  db,
  signAccessToken,
  signRefreshToken,
  successResponse,
  errorResponse,
  cleanUser,
} from '@codehub/shared/backend';
import { User } from '@codehub/shared/types';

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

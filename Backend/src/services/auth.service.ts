import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { env } from "../config/env";
import { AuthPayload } from "../types";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { RegisterInput, LoginInput } from "../validators";

const generateTokens = (payload: AuthPayload) => {
  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn as any });
  return { accessToken, refreshToken };
};

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictError("Email already registered");

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { user, ...tokens };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
  },

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as AuthPayload;

      const session = await prisma.session.findUnique({ where: { token: refreshToken } });
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedError("Invalid or expired refresh token");
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) throw new UnauthorizedError("User not found");

      const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

      await prisma.session.delete({ where: { id: session.id } });
      await prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  },

  async logout(refreshToken: string) {
    await prisma.session.deleteMany({ where: { token: refreshToken } });
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true, role: true, isVerified: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedError("User not found");
    return user;
  },
};

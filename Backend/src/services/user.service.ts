import { prisma } from "../prisma/client";
import { NotFoundError } from "../utils/errors";

export const userService = {
  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, name: true, email: true, avatar: true, role: true, isVerified: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, avatar: true, role: true, isVerified: true, createdAt: true },
    });
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async update(id: string, data: { name?: string; avatar?: string }) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User");

    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, avatar: true, role: true, updatedAt: true },
    });
  },

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User");

    await prisma.user.delete({ where: { id } });
  },
};

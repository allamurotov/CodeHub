import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, User, Course, Lesson, Material } from '../../types/index.js';

function resolveDbFilePath(): string {
  // 1. Explicit environment variable DB_PATH or DB_FILE
  const envPath = process.env.DB_PATH || process.env.DB_FILE;
  if (envPath) {
    return path.resolve(envPath);
  }

  // 2. Monorepo root discovery starting from process.cwd()
  let currentDir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(currentDir, 'data', 'db.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  // 3. Fallback to default in process.cwd()
  return path.resolve(process.cwd(), 'data', 'db.json');
}

const DB_FILE = resolveDbFilePath();
const DATA_DIR = path.dirname(DB_FILE);

function ensureInitialDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content) as DatabaseSchema;
    } catch {
      // If corrupted, re-seed
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);
  const userPasswordHash = bcrypt.hashSync('student123', salt);

  const initialUsers: User[] = [
    {
      id: 'usr_admin_01',
      name: 'Sardor (Admin)',
      email: 'admin@codehub.uz',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      permissions: ['MANAGE_ADMINS', 'MANAGE_CONTENT', 'MANAGE_USERS'],
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_student_01',
      name: 'Talaba',
      email: 'student@codehub.uz',
      passwordHash: userPasswordHash,
      role: 'USER',
      permissions: [],
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const initialCourses: Course[] = [
    {
      id: 'crs_react_01',
      title: 'React.js va Zamonaviy Web Dasturlash',
      description: "React 19, Hooks, Context API va TailwindCSS yordamida zamonaviy interfeyslar yaratish to'liq kursi.",
      coverImage: null,
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'crs_nodejs_02',
      title: 'Full-Stack Node.js va TypeScript',
      description: 'REST API, Express.js, TypeScript, PostgreSQL va Docker yordamida xavfsiz va tezkor backend tizimlar yaratish.',
      coverImage: null,
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'crs_nextjs_03',
      title: 'Next.js 15 - Katta Loyihalar Arxitekturasi',
      description: 'Server Components, SSR, Server Actions va SEO optimizatsiyasi bilan toza Full-Stack arxitektura.',
      coverImage: null,
      published: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const initialLessons: Lesson[] = [
    {
      id: 'lsn_react_01',
      courseId: 'crs_react_01',
      title: 'React asoslari va loyiha tuzilmasi',
      description: 'Vite yordamida React loyihasini sozlash, JSX sintaksisi va komponentlar.',
      videoUrl: null,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lsn_react_02',
      courseId: 'crs_react_01',
      title: 'State va Props bilan ishlash',
      description: 'useState, useEffect hooklari va lifecycle tushunchasi.',
      videoUrl: null,
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lsn_node_01',
      courseId: 'crs_nodejs_02',
      title: 'Express.js va Middleware arxitekturasi',
      description: 'Serverni ishga tushirish, marshrutlash (routing) va xatoliklarni ushlash.',
      videoUrl: null,
      order: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  const initialMaterials: Material[] = [
    {
      id: 'mat_01',
      lessonId: 'lsn_react_01',
      title: 'React CheatSheet (PDF)',
      fileUrl: '/uploads/materials/react-cheatsheet.pdf',
      fileType: 'application/pdf',
      createdAt: new Date().toISOString(),
    },
  ];

  const schema: DatabaseSchema = {
    users: initialUsers,
    courses: initialCourses,
    lessons: initialLessons,
    materials: initialMaterials,
    enrollments: [
      {
        id: 'enr_01',
        userId: 'usr_student_01',
        courseId: 'crs_react_01',
        enrolledAt: new Date().toISOString(),
      },
    ],
    progress: [
      {
        id: 'prg_01',
        userId: 'usr_student_01',
        lessonId: 'lsn_react_01',
        completedAt: new Date().toISOString(),
      },
    ],
    refreshTokens: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
  return schema;
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = ensureInitialDatabase();
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  get users() {
    return {
      find: () => this.data.users,
      findById: (id: string) => this.data.users.find((u) => u.id === id),
      findByEmail: (email: string) => this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
      create: (user: User) => {
        this.data.users.push(user);
        this.save();
        return user;
      },
      update: (id: string, updates: Partial<User>) => {
        const idx = this.data.users.findIndex((u) => u.id === id);
        if (idx === -1) return null;
        this.data.users[idx] = { ...this.data.users[idx], ...updates };
        this.save();
        return this.data.users[idx];
      },
      delete: (id: string) => {
        const initialLen = this.data.users.length;
        this.data.users = this.data.users.filter((u) => u.id !== id);
        this.save();
        return this.data.users.length < initialLen;
      },
    };
  }

  get courses() {
    return {
      find: (publishedOnly = false) => {
        return publishedOnly ? this.data.courses.filter((c) => c.published) : this.data.courses;
      },
      findById: (id: string) => this.data.courses.find((c) => c.id === id),
      create: (course: Course) => {
        this.data.courses.push(course);
        this.save();
        return course;
      },
      update: (id: string, updates: Partial<Course>) => {
        const idx = this.data.courses.findIndex((c) => c.id === id);
        if (idx === -1) return null;
        this.data.courses[idx] = { ...this.data.courses[idx], ...updates };
        this.save();
        return this.data.courses[idx];
      },
      delete: (id: string) => {
        this.data.courses = this.data.courses.filter((c) => c.id !== id);
        const lessons = this.data.lessons.filter((l) => l.courseId === id);
        const lessonIds = lessons.map((l) => l.id);
        this.data.lessons = this.data.lessons.filter((l) => l.courseId !== id);
        this.data.materials = this.data.materials.filter((m) => !lessonIds.includes(m.lessonId));
        this.data.enrollments = this.data.enrollments.filter((e) => e.courseId !== id);
        this.data.progress = this.data.progress.filter((p) => !lessonIds.includes(p.lessonId));
        this.save();
        return true;
      },
    };
  }

  get lessons() {
    return {
      findByCourseId: (courseId: string) =>
        this.data.lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order),
      findById: (id: string) => this.data.lessons.find((l) => l.id === id),
      create: (lesson: Lesson) => {
        this.data.lessons.push(lesson);
        this.save();
        return lesson;
      },
      delete: (id: string) => {
        this.data.lessons = this.data.lessons.filter((l) => l.courseId !== id);
        this.data.materials = this.data.materials.filter((m) => m.lessonId !== id);
        this.data.progress = this.data.progress.filter((p) => p.lessonId !== id);
        this.save();
        return true;
      },
    };
  }

  get materials() {
    return {
      findByLessonId: (lessonId: string) => this.data.materials.filter((m) => m.lessonId === lessonId),
      findById: (id: string) => this.data.materials.find((m) => m.id === id),
      create: (mat: Material) => {
        this.data.materials.push(mat);
        this.save();
        return mat;
      },
      delete: (id: string) => {
        this.data.materials = this.data.materials.filter((m) => m.id !== id);
        this.save();
        return true;
      },
    };
  }

  get enrollments() {
    return {
      findByUser: (userId: string) => this.data.enrollments.filter((e) => e.userId === userId),
      find: (userId: string, courseId: string) =>
        this.data.enrollments.find((e) => e.userId === userId && e.courseId === courseId),
      create: (userId: string, courseId: string) => {
        const existing = this.data.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
        if (existing) return existing;
        const record = {
          id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          courseId,
          enrolledAt: new Date().toISOString(),
        };
        this.data.enrollments.push(record);
        this.save();
        return record;
      },
    };
  }

  get progress() {
    return {
      findByUserAndCourse: (userId: string, courseId: string) => {
        const lessons = this.data.lessons.filter((l) => l.courseId === courseId);
        const lessonIds = new Set(lessons.map((l) => l.id));
        return this.data.progress.filter((p) => p.userId === userId && lessonIds.has(p.lessonId));
      },
      toggleComplete: (userId: string, lessonId: string) => {
        const idx = this.data.progress.findIndex((p) => p.userId === userId && p.lessonId === lessonId);
        if (idx !== -1) {
          this.data.progress.splice(idx, 1);
          this.save();
          return false;
        }
        this.data.progress.push({
          id: `prg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          lessonId,
          completedAt: new Date().toISOString(),
        });
        this.save();
        return true;
      },
    };
  }

  get refreshTokens() {
    return {
      save: (userId: string, token: string, expiresAt: string) => {
        this.data.refreshTokens.push({
          id: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          token,
          expiresAt,
        });
        this.save();
      },
      find: (token: string) => this.data.refreshTokens.find((r) => r.token === token),
      remove: (token: string) => {
        this.data.refreshTokens = this.data.refreshTokens.filter((r) => r.token !== token);
        this.save();
      },
    };
  }
}

export const db = new Database();

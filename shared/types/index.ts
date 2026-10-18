export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: Role;
  permissions: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface Material {
  id: string;
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string | null;
  order: number;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: string;
}

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  users: User[];
  courses: Course[];
  lessons: Lesson[];
  materials: Material[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
  refreshTokens: RefreshTokenRecord[];
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: Role;
  permissions: string[];
}

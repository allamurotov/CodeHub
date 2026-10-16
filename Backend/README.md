# CodeHub Backend API

Express.js + TypeScript asosida qurilgan ta'lim platformasi uchun to'liq RESTful API.

## Texnologiyalar
- **Node.js** & **TypeScript**
- **Express.js**
- **JWT (JSON Web Token)** - Access va Refresh tokenlar
- **Bcryptjs** - Parollarni xeshlash
- **Multer** - Fayllarni yuklash (kurs rasmlari, video, materiallar)
- **CORS** & **Dotenv**

---

## O'rnatish va Ishga tushirish

1. Qaramliklarni o'rnatish:
   ```bash
   npm install
   ```

2. Ishchi muhitda ishga tushirish (Hot-reload):
   ```bash
   npm run dev
   ```

3. Production uchun build qilish:
   ```bash
   npm run build
   npm start
   ```

---

## Standart Foydalanuvchilar (Seed Data)

Baza avtomatik ravishda birinchi ishga tushganda quyidagi foydalanuvchilar bilan to'ldiriladi:

| Rol | Email | Parol | Ruxsatlar |
|---|---|---|---|
| **Super Admin** | `admin@codehub.uz` | `admin123` | Barcha ruxsatlar (`MANAGE_ADMINS`, `MANAGE_CONTENT`, `MANAGE_USERS`) |
| **Talaba (User)** | `student@codehub.uz` | `student123` | Kurslarni ko'rish va o'qish |

---

## Asosiy API Marshrutlari

### 1. Autentifikatsiya (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Ro'yxatdan o'tish (`name`, `email`, `password`)
- `POST /api/v1/auth/login` - Tizimga kirish (`email`, `password`)
- `POST /api/v1/auth/refresh` - Access tokenni yangilash (`refreshToken`)
- `GET /api/v1/auth/profile` - Joriy foydalanuvchi ma'lumotlari (Bearer token)
- `POST /api/v1/auth/logout` - Tizimdan chiqish
- `GET /api/v1/auth/google` & `GET /api/v1/auth/github` - OAuth kirish oynasi

### 2. Kurslar (`/api/v1/courses`)
- `GET /api/v1/courses` - Chop etilgan kurslar ro'yxati
- `GET /api/v1/courses/admin` - Barcha kurslar (Admin uchun)
- `GET /api/v1/courses/my` - Mening kurslarim (A'zo bo'lingan)
- `GET /api/v1/courses/:id` - Kurs tafsilotlari, darslar va materiallar
- `POST /api/v1/courses/:id/enroll` - Kursga a'zo bo'lish
- `POST /api/v1/courses` - Yangi kurs qo'shish (Admin, `multipart/form-data`)
- `PATCH /api/v1/courses/:id` - Kursni tahrirlash (Admin, `multipart/form-data`)
- `DELETE /api/v1/courses/:id` - Kursni o'chirish (Admin)

### 3. Darslar va Materiallar (`/api/v1/lessons`, `/api/v1/materials`)
- `POST /api/v1/courses/:courseId/lessons` - Dars qo'shish (`multipart/form-data`)
- `DELETE /api/v1/lessons/:id` - Darsni o'chirish
- `POST /api/v1/lessons/:id/complete` - Darsni yakunlash / progress
- `POST /api/v1/lessons/:lessonId/materials` - Darsga material qo'shish (`file`)
- `DELETE /api/v1/materials/:id` - Materialni o'chirish

### 4. Foydalanuvchilar Boshqaruvi (`/api/v1/admin/users`)
- `GET /api/v1/admin/users?page=1&limit=10` - Foydalanuvchilar ro'yxati
- `PATCH /api/v1/admin/users/:id/role` - Rol va ruxsatlarni o'zgartirish
- `DELETE /api/v1/admin/users/:id` - Foydalanuvchini o'chirish

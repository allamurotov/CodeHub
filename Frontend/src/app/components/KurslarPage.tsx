import { useEffect, useState } from "react";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { getCourseVisual, CourseVisual } from "../lib/courseVisuals";

interface ApiCourse {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  createdAt: string;
  _count: { lessons: number };
}

function isNewCourse(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14;
}

export function KurslarPage({ onNavigate }: { onNavigate?: (p: string, data?: unknown) => void }) {
  const { colors } = useTheme();
  const { isLoggedIn } = useAuth();
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ courses: ApiCourse[] }>("/courses")
      .then((res) => res.data && setCourses(res.data.courses))
      .catch(() => toast.error("Kurslarni yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  }, []);

  const handleCourseClick = (course: ApiCourse) => {
    if (!isLoggedIn) {
      toast("Diqqat! Ro'yxatdan o'ting", {
        style: { background: "#2e0f0f", border: "1px solid rgba(248,113,113,0.3)", color: "#fca5a5", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" },
      });
      return;
    }
    onNavigate?.("kurs-detail", course.id);
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <section className="pt-28 pb-20 px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              color: "#a78bfa",
            }}
          >
            ✦ TO'LIQ KURSLAR
          </motion.div>

          <div className="overflow-hidden mb-0.1">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: colors.text }}
            >
              O'zingizga mos
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5  ">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold"
              style={{
                fontSize: "clamp(2rem,5vw,3.5rem)",
                background: "linear-gradient(90deg, #22d3ee, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              kursni tanlang
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: colors.textMuted }}
          >
            Eng so'nggi texnologiyalar, amaliy loyihalar va professional mentorlar yordamida dasturlashni chuqur o'raning.
          </motion.p>
        </div>

        {loading ? (
          <p className="text-center text-sm" style={{ color: colors.textMuted }}>Yuklanmoqda...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-sm" style={{ color: colors.textMuted }}>Hozircha kurslar mavjud emas.</p>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <CourseCard
                  course={course}
                  visual={getCourseVisual(course.title)}
                  onClick={() => handleCourseClick(course)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CourseCard({
  course,
  visual,
  onClick,
}: {
  course: ApiCourse;
  visual: CourseVisual;
  onClick?: () => void;
}) {
  const { colors, isDark } = useTheme();
  const v = visual;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, boxShadow: isDark ? "0 24px 48px rgba(0,0,0,0.6)" : "0 24px 48px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)",
        }}
      />

      {isNewCourse(course.createdAt) && (
        <span
          className="absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-semibold"
          style={{ background: "rgba(124,58,237,0.25)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.4)" }}
        >
          Yangi
        </span>
      )}

      <div
        className="flex items-center justify-center rounded-xl mb-5 relative overflow-hidden"
        style={{
          height: 120,
          background: course.coverImage ? undefined : v.gradient,
          boxShadow: v.shadow,
        }}
      >
        {course.coverImage ? (
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <span
            className="font-black select-none"
            style={{
              fontSize: "clamp(2rem, 6vw, 2.8rem)",
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.03em",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {v.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs mb-3" style={{ color: colors.textMuted }}>
        <span className="flex items-center gap-1"><BookOpen size={12} />{course._count.lessons} dars</span>
      </div>

      <h3 className="font-semibold mb-4" style={{ color: colors.text }}>{course.title}</h3>

      <motion.button
        className="flex items-center gap-2 text-sm transition-colors"
        style={{ color: colors.textMuted }}
        whileHover={{ x: 4, color: "#a78bfa" }}
        transition={{ duration: 0.2 }}
      >
        Batafsil ko'rish
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: colors.surface2 }}
        >
          <ArrowUpRight size={12} />
        </span>
      </motion.button>
    </motion.div>
  );
}

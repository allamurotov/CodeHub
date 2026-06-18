import { Clock, BookOpen, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useEnrolledCourses } from "../context/EnrolledCoursesContext";

const courses = [
  { name: "React.js", isNew: false, hours: 32, lessons: 24 },
  { name: "Vue.js", isNew: true, hours: 28, lessons: 20 },
  { name: "Angular", isNew: false, hours: 30, lessons: 22 },
  { name: "Next.js", isNew: true, hours: 36, lessons: 28 },
  { name: "Node.js", isNew: true, hours: 24, lessons: 18 },
  { name: "TypeScript", isNew: false, hours: 20, lessons: 16 },
  { name: "React Native", isNew: true, hours: 40, lessons: 32 },
  { name: "NestJS", isNew: false, hours: 26, lessons: 20 },
  { name: "MongoDB", isNew: false, hours: 18, lessons: 14 },
];

const courseVisuals: Record<string, { text: string; gradient: string; shadow: string; accent: string }> = {
  "React.js": { text: "React", gradient: "linear-gradient(135deg, #61dafb, #20232a)", shadow: "0 8px 32px rgba(97,218,251,0.3)", accent: "#61dafb" },
  "Vue.js": { text: "Vue", gradient: "linear-gradient(135deg, #42b883, #35495e)", shadow: "0 8px 32px rgba(66,184,131,0.3)", accent: "#42b883" },
  "Angular": { text: "Angular", gradient: "linear-gradient(135deg, #dd0031, #c3002f)", shadow: "0 8px 32px rgba(221,0,49,0.3)", accent: "#dd0031" },
  "Next.js": { text: "Next", gradient: "linear-gradient(135deg, #ffffff, #000000)", shadow: "0 8px 32px rgba(255,255,255,0.15)", accent: "#ffffff" },
  "Node.js": { text: "Node", gradient: "linear-gradient(135deg, #539e43, #333333)", shadow: "0 8px 32px rgba(83,158,67,0.3)", accent: "#539e43" },
  "TypeScript": { text: "TypeScript", gradient: "linear-gradient(135deg, #3178c6, #235a97)", shadow: "0 8px 32px rgba(49,120,198,0.3)", accent: "#3178c6" },
  "React Native": { text: "RN", gradient: "linear-gradient(135deg, #61dafb, #7c3aed)", shadow: "0 8px 32px rgba(97,218,251,0.3)", accent: "#61dafb" },
  "NestJS": { text: "Nest", gradient: "linear-gradient(135deg, #e0234e, #111111)", shadow: "0 8px 32px rgba(224,35,78,0.3)", accent: "#e0234e" },
  "MongoDB": { text: "MongoDB", gradient: "linear-gradient(135deg, #00ed64, #10a546)", shadow: "0 8px 32px rgba(0,237,100,0.3)", accent: "#00ed64" },
};

export function KurslarPage({ onNavigate }: { onNavigate?: (p: string, data?: unknown) => void }) {
  const { colors, isDark } = useTheme();
  const { addCourse } = useEnrolledCourses();

  const handleCourseClick = (courseName: string) => {
    addCourse(courseName);
    onNavigate?.("dashboard");
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

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
                <CourseCard
                  course={course}
                  visual={courseVisuals[course.name]}
                  onClick={() => handleCourseClick(course.name)}
                />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseCard({
  course,
  visual,
  onClick,
}: {
  course: typeof courses[0];
  visual?: { text: string; gradient: string; shadow: string; accent: string };
  onClick?: () => void;
}) {
  const { colors, isDark } = useTheme();

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

      {course.isNew && (
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
          background: visual?.gradient || (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
          boxShadow: visual?.shadow || "none",
        }}
      >
        <span
          className="font-black select-none"
          style={{
            fontSize: "clamp(2rem, 6vw, 2.8rem)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.03em",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {visual?.text || course.name}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs mb-3" style={{ color: colors.textMuted }}>
        <span className="flex items-center gap-1"><Clock size={12} />{course.hours} soat</span>
        <span className="flex items-center gap-1"><BookOpen size={12} />{course.lessons} dars</span>
      </div>

      <h3 className="font-semibold mb-4" style={{ color: colors.text }}>{course.name}</h3>

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



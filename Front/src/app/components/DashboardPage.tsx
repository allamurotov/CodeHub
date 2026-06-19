import { LayoutDashboard, BookOpen, FolderKanban, Database, MessageCircle, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useEnrolledCourses } from "../context/EnrolledCoursesContext";

interface DashboardPageProps {
  onNavigate: (p: string) => void;
}

const sidebarLinks = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "kurslar", icon: BookOpen, label: "Kurslar" },
  { id: "loyihalar", icon: FolderKanban, label: "Loyihalar" },
  { id: "manbalar", icon: Database, label: "Manbalar" },
  { id: "boglanish", icon: MessageCircle, label: "Bog'lanish" },
];

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { courses } = useEnrolledCourses();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarBg = isDark ? "#0e0e14" : "#f0f0f8";
  const activeBg = isDark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.1)";

  const SidebarContent = () => (
    <>
      <div
        className="flex items-center gap-2 px-3 mb-8 cursor-pointer"
        onClick={() => { onNavigate("home"); setSidebarOpen(false); }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}>
          <span className="text-white text-xs font-bold">S</span>
        </div>
        <span className="font-semibold" style={{ color: colors.text }}>CodeHub</span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {sidebarLinks.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            onClick={() => { if (id !== "dashboard") { onNavigate(id); setSidebarOpen(false); } }}
            whileHover={{ x: 2 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left"
            style={{
              background: id === "dashboard" ? activeBg : "transparent",
              color: id === "dashboard" ? "#a78bfa" : colors.textMuted,
              fontWeight: id === "dashboard" ? 600 : 400,
              borderLeft: id === "dashboard" ? "3px solid #7c3aed" : "3px solid transparent",
            }}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </nav>

      <motion.button
        onClick={() => { logout(); onNavigate("home"); }}
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mt-4"
        style={{ color: colors.textMuted }}
      >
        <LogOut size={16} />
        Chiqish
      </motion.button>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: colors.bg }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-52 flex-col py-5 px-3 z-40"
        style={{ background: sidebarBg, borderRight: `1px solid ${colors.border}` }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-56 flex flex-col py-5 px-3 z-50 md:hidden"
              style={{ background: sidebarBg, borderRight: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4"
                style={{ color: colors.textMuted }}
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 md:ml-52 p-5 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Mobile menu btn */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }}
          >
            <Menu size={18} />
          </button>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              {user?.name.charAt(0)}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: colors.text }}>{user?.name}</span>
          </div>
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Sizning Panelingiz</h1>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            O'quv kurslaringiz va amaliy loyihalaringiz natijalarini kuzatib boring.
          </p>
        </motion.div>

        {/* Course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {courses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-sm mb-4" style={{ color: colors.textMuted }}>Hali hech qanday kurs tanlanmagan</p>
              <motion.button
                onClick={() => onNavigate("kurslar")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                }}
              >
                Kurslarni ko'rish →
              </motion.button>
            </motion.div>
          )}
          {courses.map((course, i) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 16px 40px rgba(0,0,0,0.1)" }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <div
                className="relative flex items-center justify-center"
                style={{ height: 130, background: course.bg }}
              >
                <div className="absolute top-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}
                  >
                    ⊙ Courses
                  </span>
                </div>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-2xl"
                  style={{
                    background: course.color,
                    color: course.color === "#ffffff" ? "#000" : "white",
                  }}
                >
                  {course.label}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: colors.text }}>{course.name}</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-purple-400"
                    style={{ background: isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.08)" }}
                  >
                    ↗
                  </motion.button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: colors.textMuted }}>Bajarildi</span>
                    <span className="font-semibold" style={{ color: colors.text }}>{course.progress}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: colors.surface2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      className="h-1.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #22d3ee)" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              onClick={() => onNavigate("kurslar")}
              whileHover={{ y: -4, borderColor: "rgba(124,58,237,0.5)" }}
              className="rounded-2xl flex flex-col items-center justify-center cursor-pointer py-10 transition-colors"
              style={{ background: "transparent", border: `2px dashed ${colors.border}` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.08)" }}
              >
                <span className="text-2xl text-purple-400">+</span>
              </div>
              <p className="text-sm font-medium" style={{ color: colors.textMuted }}>Kurs qo'shish</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

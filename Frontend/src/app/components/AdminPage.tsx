import { Users, BookOpen, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { AdminUsersPage } from "./admin/AdminUsersPage";
import { AdminCoursesPage } from "./admin/AdminCoursesPage";

interface AdminPageProps {
  onNavigate: (p: string) => void;
}

type Section = "users" | "courses";

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canManageUsers = isSuperAdmin || user?.permissions.includes("MANAGE_USERS") || user?.permissions.includes("MANAGE_ADMINS");
  const canManageContent = isSuperAdmin || user?.permissions.includes("MANAGE_CONTENT");

  const sections = [
    { id: "users" as Section, icon: Users, label: "Foydalanuvchilar", visible: canManageUsers },
    { id: "courses" as Section, icon: BookOpen, label: "Kurslar", visible: canManageContent },
  ].filter((s) => s.visible);

  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) {
      toast("Diqqat! Bu sahifaga kirish huquqingiz yo'q", {
        style: { background: "#2e0f0f", border: "1px solid rgba(248,113,113,0.3)", color: "#fca5a5", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" },
      });
      onNavigate("home");
      return;
    }
    if (!section && sections.length > 0) setSection(sections[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  if (!user || !isAdmin) return null;

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

      <div className="px-3 mb-4 flex items-center gap-2">
        <ShieldCheck size={14} className="text-purple-400" />
        <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
          {isSuperAdmin ? "Super Admin" : "Admin"}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {sections.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            onClick={() => { setSection(id); setSidebarOpen(false); }}
            whileHover={{ x: 2 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left"
            style={{
              background: id === section ? activeBg : "transparent",
              color: id === section ? "#a78bfa" : colors.textMuted,
              fontWeight: id === section ? 600 : 400,
              borderLeft: id === section ? "3px solid #7c3aed" : "3px solid transparent",
            }}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </nav>

      <motion.button
        onClick={() => { onNavigate("dashboard"); setSidebarOpen(false); }}
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1"
        style={{ color: colors.textMuted }}
      >
        Foydalanuvchi paneliga qaytish
      </motion.button>
      <motion.button
        onClick={() => { logout(); onNavigate("home"); }}
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
        style={{ color: colors.textMuted }}
      >
        <LogOut size={16} />
        Chiqish
      </motion.button>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: colors.bg }}>
      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col py-5 px-3 z-40"
        style={{ background: sidebarBg, borderRight: `1px solid ${colors.border}` }}
      >
        <SidebarContent />
      </aside>

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

      <main className="flex-1 md:ml-56 p-5 md:p-8">
        <div className="flex items-center justify-between mb-8 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }}
          >
            <Menu size={18} />
          </button>
        </div>

        {sections.length === 0 && (
          <p style={{ color: colors.textMuted }}>Sizga tayinlangan admin ruxsatlari yo'q.</p>
        )}
        {section === "users" && canManageUsers && <AdminUsersPage />}
        {section === "courses" && canManageContent && <AdminCoursesPage />}
      </main>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Sparkles, GraduationCap, Settings, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LoginModal } from "./LoginModal";
import { AccountModal } from "./AccountModal";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { id: "kurslar", label: "Kurslar" },
  { id: "loyihalar", label: "Loyihalar" },
  { id: "manbalar", label: "Manbalar" },
  { id: "boglanish", label: "Bog'lanish" },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { colors, isDark, toggle } = useTheme();
  const { user, logout, isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("open-auth", handler);
    return () => window.removeEventListener("open-auth", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowDropdown(false); setShowMobileMenu(false); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close mobile menu on navigate
  const navigate = (p: string) => {
    onNavigate(p);
    setShowMobileMenu(false);
  };

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Asosiy navigatsiya"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
      >
        <motion.div
          animate={{
            boxShadow: scrolled
              ? isDark ? "0 8px 40px rgba(0,0,0,0.7)" : "0 8px 40px rgba(0,0,0,0.12)"
              : isDark ? "0 4px 32px rgba(0,0,0,0.5)" : "0 4px 32px rgba(0,0,0,0.07)",
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-full border w-full max-w-2xl md:w-auto md:gap-6 md:px-5"
          style={{
            background: colors.navBg,
            borderColor: colors.border,
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo */}
          <motion.button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 flex-shrink-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <GraduationCap size={18} color="white" />
            </motion.div>
            <span className="font-semibold text-lg" style={{ color: colors.text }}>CodeHub</span>
          </motion.button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="text-sm relative py-1"
                style={{
                  color: currentPage === item.id ? colors.text : colors.textMuted,
                  fontWeight: currentPage === item.id ? 600 : 400,
                }}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #22d3ee)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ color: colors.textMuted }}
              aria-label={`${isDark ? "Yorug'q" : "Qorong'u"} rejimga o'tish`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Moon size={16} /> : <Sun size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Desktop: auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <motion.button
                    onClick={() => navigate("dashboard")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: currentPage === "dashboard"
                        ? "linear-gradient(135deg, #3b28cc, #6d28d9)"
                        : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      color: currentPage === "dashboard" ? "#fff" : colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </motion.button>

                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      onClick={() => setShowDropdown((v) => !v)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                    >
                      {user?.name.charAt(0).toUpperCase()}
                    </motion.button>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="absolute right-0 top-12 w-64 rounded-2xl overflow-hidden z-50"
                          style={{
                            background: isDark ? "#1a1a22" : "#ffffff",
                            border: `1px solid ${colors.border}`,
                            boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.7)" : "0 20px 60px rgba(0,0,0,0.15)",
                          }}
                        >
                          <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                            >
                              {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: colors.text }}>{user?.name}</p>
                              <p className="text-xs truncate" style={{ color: colors.textMuted }}>{user?.email}</p>
                            </div>
                          </div>
                          <div className="py-2">
                            {[
                              { icon: Settings, label: "Manage account", action: () => { setShowDropdown(false); setShowAccount(true); } },
                              { icon: LogOut, label: "Sign out", action: () => { setShowDropdown(false); logout(); navigate("home"); } },
                            ].map(({ icon: Icon, label, action }) => (
                              <motion.button
                                key={label}
                                onClick={action}
                                whileHover={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm"
                                style={{ color: colors.textMuted }}
                              >
                                <Icon size={15} />
                                {label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.button
                  onClick={() => setShowLogin(true)}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(109,40,217,0.6)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #3b28cc, #6d28d9)",
                    boxShadow: "0 0 16px rgba(109,40,217,0.35)",
                  }}
                >
                  Boshlash
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <Sparkles size={13} />
                  </motion.span>
                </motion.button>
              )}
            </div>

            {/* Mobile: hamburger */}
            <motion.button
              onClick={() => setShowMobileMenu((v) => !v)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                background: colors.surface2,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
              aria-label="Menyu"
              aria-expanded={showMobileMenu}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={showMobileMenu ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{
                background: isDark ? "#111116" : "#ffffff",
                borderLeft: `1px solid ${colors.border}`,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
                    <GraduationCap size={16} color="white" />
                  </div>
                  <span className="font-semibold" style={{ color: colors.text }}>CodeHub</span>
                </div>
                <motion.button
                  onClick={() => setShowMobileMenu(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color: colors.textMuted }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navLinks.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-sm text-left font-medium"
                    style={{
                      background: currentPage === item.id
                        ? "rgba(124,58,237,0.15)"
                        : "transparent",
                      color: currentPage === item.id ? "#a78bfa" : colors.textMuted,
                      borderLeft: currentPage === item.id ? "3px solid #7c3aed" : "3px solid transparent",
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {isLoggedIn && (
                  <motion.button
                    onClick={() => navigate("dashboard")}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 }}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-left font-medium"
                    style={{
                      background: currentPage === "dashboard" ? "rgba(124,58,237,0.15)" : "transparent",
                      color: currentPage === "dashboard" ? "#a78bfa" : colors.textMuted,
                      borderLeft: currentPage === "dashboard" ? "3px solid #7c3aed" : "3px solid transparent",
                    }}
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </motion.button>
                )}
              </nav>

              {/* Bottom auth */}
              <div className="px-4 pb-8 space-y-3" style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 20 }}>
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: colors.surface2 }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: colors.text }}>{user?.name}</p>
                        <p className="text-xs truncate" style={{ color: colors.textMuted }}>{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowMobileMenu(false); setShowAccount(true); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                      style={{ color: colors.textMuted, background: colors.surface2 }}
                    >
                      <Settings size={14} /> Manage account
                    </button>
                    <button
                      onClick={() => { logout(); navigate("home"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400"
                      style={{ background: "rgba(239,68,68,0.08)" }}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </>
                ) : (
                  <motion.button
                    onClick={() => { setShowMobileMenu(false); setShowLogin(true); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#3b28cc,#6d28d9)", boxShadow: "0 0 16px rgba(109,40,217,0.35)" }}
                  >
                    Boshlash <Sparkles size={13} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      </AnimatePresence>
    </>
  );
}

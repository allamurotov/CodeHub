import { useState } from "react";
import { X, User, Shield, Plus, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface AccountModalProps {
  onClose: () => void;
}

export function AccountModal({ onClose }: AccountModalProps) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const sidebarBg = isDark ? "#1a1a22" : "#f4f4f8";
  const mainBg = isDark ? "#111116" : "#ffffff";
  const separatorColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="w-full max-w-3xl rounded-2xl overflow-hidden flex"
        style={{
          background: mainBg,
          border: `1px solid ${colors.border}`,
          boxShadow: isDark ? "0 32px 100px rgba(0,0,0,0.8)" : "0 32px 100px rgba(0,0,0,0.2)",
          minHeight: 420,
        }}
      >
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 p-6" style={{ background: sidebarBg, borderRight: `1px solid ${separatorColor}` }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: colors.text }}>Account</h2>
          <p className="text-xs mb-6" style={{ color: colors.textMuted }}>Manage your account info.</p>

          <nav className="space-y-1">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "security", label: "Security", icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id as "profile" | "security")}
                whileHover={{ x: 2 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left"
                style={{
                  background: activeTab === id
                    ? isDark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.1)"
                    : "transparent",
                  color: activeTab === id ? "#a78bfa" : colors.textMuted,
                  fontWeight: activeTab === id ? 600 : 400,
                }}
              >
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 relative">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-5 right-5"
            style={{ color: colors.textMuted }}
          >
            <X size={18} />
          </motion.button>

          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.text }}>Profile details</h3>

              {/* Profile row */}
              <div className="flex items-center justify-between py-5" style={{ borderBottom: `1px solid ${separatorColor}` }}>
                <span className="text-sm font-medium" style={{ color: colors.text }}>Profile</span>
                <div className="flex items-center gap-3 flex-1 mx-8">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                  >
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>{user?.name}</span>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap">
                  Update profile
                </button>
              </div>

              {/* Email row */}
              <div className="py-5" style={{ borderBottom: `1px solid ${separatorColor}` }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>Email addresses</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: colors.textMuted }}>{user?.email}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                        color: colors.textMuted,
                      }}
                    >
                      Primary
                    </span>
                  </div>
                  <button style={{ color: colors.textMuted }}><MoreHorizontal size={16} /></button>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus size={14} />
                  Add email address
                </button>
              </div>

              {/* Connected accounts */}
              <div className="py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>Connected accounts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GoogleIcon />
                    <span className="text-sm" style={{ color: colors.textMuted }}>Google · {user?.email}</span>
                  </div>
                  <button style={{ color: colors.textMuted }}><MoreHorizontal size={16} /></button>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus size={14} />
                  Connect account
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: colors.text }}>Security</h3>
              <div className="py-5" style={{ borderBottom: `1px solid ${separatorColor}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>Password</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>Set a permanent password to log in to your account.</p>
                  </div>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Set password</button>
                </div>
              </div>
              <div className="py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>Two-factor authentication</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>Add an extra layer of security to your account.</p>
                  </div>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Enable</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

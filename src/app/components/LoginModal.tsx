import { useState } from "react";
import { X, Github } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [password, setPassword] = useState("");

  const handleContinue = () => {
    if (step === "email" && email) {
      setStep("password");
    } else if (step === "password") {
      login({ name: "Sardor allamurotov", email, avatar: "S" });
      onClose();
    }
  };

  const handleOAuth = (provider: string) => {
    const oauthUrls: Record<string, string> = {
      GitHub: `https://github.com/login/oauth/authorize?client_id=GITHUB_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/github/callback")}&scope=user:email`,
      Google: `https://accounts.google.com/o/oauth2/auth?client_id=GOOGLE_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/google/callback")}&scope=email+profile&response_type=code`,
    };
    const url = oauthUrls[provider];
    if (url) {
      const w = 500, h = 600;
      const left = (screen.width - w) / 2, top = (screen.height - h) / 2;
      window.open(url, `${provider} Auth`, `width=${w},height=${h},top=${top},left=${left},popup=1`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative w-full max-w-md mx-4 p-8 rounded-2xl"
        style={{
          background: isDark ? "#111114" : "#ffffff",
          border: `1px solid ${colors.border}`,
          boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.8)" : "0 24px 80px rgba(0,0,0,0.15)",
        }}
      >
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: colors.textMuted }}
        >
          <X size={18} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Sign in to CodeHub</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>Welcome back! Please sign in to continue</p>
        </motion.div>

        {/* OAuth buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {[
            { label: "GitHub", icon: <Github size={16} /> },
            { label: "Google", icon: <GoogleIcon /> },
          ].map((btn) => (
            <motion.button
              key={btn.label}
              onClick={() => handleOAuth(btn.label)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
              style={{
                background: isDark ? "#1a1a1f" : colors.surface2,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: colors.border }} />
          <span className="text-sm" style={{ color: colors.textMuted }}>or</span>
          <div className="flex-1 h-px" style={{ background: colors.border }} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: isDark ? "#1a1a1f" : colors.surface2,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = colors.border)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          />
        </div>

        {step === "password" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4"
          >
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: isDark ? "#1a1a1f" : colors.surface2,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = colors.border)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              autoFocus
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.5)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
          }}
        >
          {step === "email" ? "Continue" : "Sign in"} ▶
        </motion.button>

        <p className="text-center text-sm mt-4" style={{ color: colors.textMuted }}>
          Don't have an account?{" "}
          <button className="text-blue-400 hover:text-blue-300 transition-colors">Sign up</button>
        </p>
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

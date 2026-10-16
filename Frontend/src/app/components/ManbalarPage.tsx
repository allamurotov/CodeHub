import { GitFork, Github, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

const repos = [
  { name: "Payme integration - MERN" },
  { name: "E-Commerce - MERN" },
  { name: "Uzum integration - MERN" },
  { name: "Click integration - MERN" },
  { name: "Telegram clone - Next.JS" },
  { name: "Advanced backend" },
  { name: "Machine learning - TensorflowJS" },
  { name: "Jira clone - NuxtJS" },
  { name: "Google drive - Next.JS", isActive: true },
  { name: "Notion clone - Next.JS", isActive: true },
  { name: "Twitter clone - MERN Stack" },
  { name: "Netflix clone - MERN Stack" },
  { name: "Paint clone - HTML, CSS & JS" },
  { name: "Netflix clone - React Native" },
  { name: "Movie app - React Native" },
  { name: "HH Clone - React Native" },
];

export function ManbalarPage() {
  const { colors, isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <section className="pt-28 pb-20 px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest"
            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc" }}
          >
            <GitFork size={12} />
            OPEN SOURCE
          </motion.div>

          <div className="overflow-hidden mb-0.5">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: colors.text }}
            >
              Loyihalarning
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold leading-none"
              style={{
                fontSize: "clamp(2rem,5vw,3.5rem)",
                background: "linear-gradient(90deg, #c084fc, #a855f7, #e879f9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              manba kodlari
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base leading-relaxed"
            style={{ color: colors.textMuted }}
          >
            Barcha premium kurslar va amaliy loyihalarning to'liq kodlarini yuklab oling.
            <br />
            O'rganing, o'zgartiring va o'z g'oyalaringiz uchun ishlating.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: colors.textMuted }}>
            <GitFork size={14} />
            Jami omborlar: <strong className="ml-1" style={{ color: colors.text }}>{repos.length} ta</strong>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Tizim faol
          </motion.div>
        </motion.div>

        <div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${colors.border}` }}
        >
          {repos.map((repo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              whileHover={{
                backgroundColor: repo.isActive
                  ? "rgba(124,58,237,0.12)"
                  : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              }}
              className="flex items-center justify-between px-6 py-4 cursor-pointer group"
              style={{
                borderBottom: i < repos.length - 1 ? `1px solid ${colors.border}` : undefined,
                background: repo.isActive
                  ? isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.05)"
                  : "transparent",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.surface2 }}
                >
                  <Terminal size={14} style={{ color: colors.textMuted }} />
                </div>
                <div>
                  <span className="text-xs block mb-0.5" style={{ color: colors.textSubtle }}>REPOSITORY</span>
                  <p className="text-sm font-semibold" style={{ color: colors.text }}>{repo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {repo.isActive && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: "rgba(124,58,237,0.25)", color: "#c4b5fd" }}
                  >
                    Faol
                  </span>
                )}
                <motion.button
                  className="w-9 h-9 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{ background: colors.surface2 }}
                  whileHover={{ scale: 1.1, background: "rgba(124,58,237,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={15} style={{ color: colors.text }} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

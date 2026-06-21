import { Sparkles, Code2 } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

const projects = [
  { name: "MERN Stack - Telegram clone", logo: "TG", color: "#2ca5e0", tags: ["React.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - X clone", logo: "X", color: "#111", border: "#555", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Drive clone", logo: "▲", color: "#4285F4", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Jira clone", logo: "JIRA", color: "#0052CC", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Notion clone", logo: "N", color: "#fff", textColor: "#000", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Netflix clone", logo: "N", color: "#e50914", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "React.js - CodeHubtube", logo: "▶", color: "#ff0000", tags: ["React.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Blog", logo: "B", color: "#7c3aed", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
];

const tagColors: Record<string, string> = {
  "React.js": "#1d4ed8", "Next.js": "#374151",
  "TailwindCSS": "#0e7490", "NodeJS": "#166534",
};

const codeLines = [
  { num: 1, tokens: [{ text: "import", color: "#c792ea" }, { text: "{ Developer }", color: "#82aaff" }, { text: "from", color: "#c792ea" }, { text: "'@/future'", color: "#c3e88d" }] },
  { num: 2, tokens: [] },
  { num: 3, tokens: [{ text: "CodeHubStudent", color: "#82aaff" }, { text: "=()=>{", color: "#89ddff" }] },
  { num: 4, tokens: [{ text: "  const ", color: "#c792ea" }, { text: "skills ", color: "#82aaff" }, { text: "=useLearn(", color: "#89ddff" }, { text: "'Next.js'", color: "#c3e88d" }, { text: ")", color: "#89ddff" }] },
  { num: 5, tokens: [{ text: "  return", color: "#c792ea" }, { text: "(", color: "#89ddff" }] },
  { num: 6, tokens: [{ text: "    <", color: "#89ddff" }, { text: "Developer", color: "#82aaff" }] },
];

export function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { colors, isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 px-5 md:px-6 text-center relative">
        {/* Glow */}
        <div
          className="absolute left-1/2 top-24 -translate-x-1/2 w-[500px] h-[280px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 cursor-pointer group"
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${colors.border}`,
            color: colors.textMuted,
          }}
          onClick={() => onNavigate("kurslar")}
        >
          CodeHub 2.0 platformasi ishga tushdi
          <motion.span
            className="text-purple-400 font-semibold"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.div>

        {/* Heading */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold"
            style={{ fontSize: "clamp(2.4rem,7vw,5rem)", color: colors.text }}
          >
            Kelajak kasbini
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-000.1">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold"
            style={{
              fontSize: "clamp(2.4rem,7vw,5rem)",
              background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            zamonaviy usulda
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-7">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold"
            style={{ fontSize: "clamp(2.4rem,7vw,5rem)", color: colors.text }}
          >
            o'rganing
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-lg mx-auto mb-10 text-base leading-relaxed px-2"
          style={{ color: colors.textMuted }}
        >
          Dasturlashni quruq nazariya bilan emas, real amaliyot va real loyihalar orqali o'rganing. Premium kurslar, ochiq kodlar va komyuniti bir joyda.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.55)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("kurslar")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
              boxShadow: "0 0 24px rgba(124,58,237,0.4)",
            }}
          >
            Kurslarni boshlash
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <Sparkles size={16} />
            </motion.span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(124,58,237,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("loyihalar")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold"
            style={{
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `1.5px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            <Code2 size={16} />
            Loyihalar
          </motion.button>
        </motion.div>

        {/* Code preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg mx-auto rounded-2xl overflow-hidden text-left"
          style={{
            background: isDark ? "#0d1117" : "#1e1e2e",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.12)"}`,
            boxShadow: isDark
              ? "0 32px 80px rgba(0,0,0,0.6)"
              : "0 32px 80px rgba(0,0,0,0.35)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: isDark ? "#161b22" : "#252535", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs ml-3" style={{ color: "rgba(255,255,255,0.35)" }}>app/page.tsx – CodeHub</span>
          </div>

          {/* Code lines */}
          <div className="px-4 py-5 font-mono text-sm">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.07 }}
                className="flex items-center gap-4 leading-7"
              >
                <span className="w-4 text-right flex-shrink-0 select-none" style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
                  {line.num}
                </span>
                <span className="flex flex-wrap gap-1">
                  {line.tokens.map((t, j) => (
                    <span key={j} style={{ color: t.color }}>{t.text}</span>
                  ))}
                </span>
              </motion.div>
            ))}
            {/* Cursor */}
            <div className="flex items-center gap-4">
              <span className="w-4 flex-shrink-0" />
              <span className="w-2 h-5 inline-block rounded-sm" style={{ background: "#7c3aed" }} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Projects section */}
      <section className="pb-16 px-5 md:px-6">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm mb-3 font-medium"
            style={{ color: colors.textMuted }}
          >
            — AMALIY LOYIHALAR —
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-bold text-2xl md:text-3xl"
            style={{ color: colors.text }}
          >
            Noldan qurilgan{" "}
            <span style={{
              background: "linear-gradient(90deg, #22d3ee, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              real loyihalar
            </span>
          </motion.h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const { colors, isDark } = useTheme();
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl overflow-hidden text-left cursor-pointer"
      style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-2.5"
        style={{ background: colors.surface2, borderBottom: `1px solid ${colors.border}` }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <div
          className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs"
          style={{ background: colors.bg, color: colors.textSubtle }}
        >
          <span className="text-purple-400">⊙</span> production build
        </div>
      </div>

      <div
        className="flex items-center justify-center py-8"
        style={{
          background: isDark
            ? "linear-gradient(180deg,#0d0d12,#111116)"
            : "linear-gradient(180deg,#f0f0f8,#e8e8f4)",
          minHeight: 120,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -4, 4, 0], scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{
              background: project.color,
              color: project.textColor || "white",
              border: project.border ? `2px solid ${project.border}` : undefined,
            }}
          >
            {project.logo}
          </motion.div>
          <span
            className="px-2.5 py-0.5 rounded text-xs font-bold tracking-widest"
            style={{ background: colors.surface3, color: colors.textMuted }}
          >
            CLONE
          </span>
        </div>
      </div>

      <div className="px-4 py-3.5">
        <p className="text-sm font-semibold mb-2.5" style={{ color: colors.text }}>{project.name}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs text-white"
              style={{ background: tagColors[tag] || "#374151" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

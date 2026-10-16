import { Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

/* ================= TYPES ================= */

type Tag =
  | "React.js"
  | "Next.js"
  | "TailwindCSS"
  | "NodeJS"
  | "React Native";

type Project = {
  name: string;
  logo: string;
  color: string;
  border?: string;
  textColor?: string;
  tags: Tag[];
};

/* ================= DATA ================= */

const projects: Project[] = [
  { name: "MERN Stack - Telegram clone", logo: "TG", color: "#2ca5e0", tags: ["React.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - X clone", logo: "X", color: "#111", border: "#555", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Drive clone", logo: "▲", color: "#4285F4", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Jira clone", logo: "JIRA", color: "#0052CC", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Notion clone", logo: "N", color: "#fff", textColor: "#000", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Netflix clone", logo: "N", color: "#e50914", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "React.js - CodeHubtube", logo: "▶", color: "#ff0000", tags: ["React.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Blog", logo: "B", color: "#7c3aed", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "React Native - Mobile App", logo: "M", color: "#0ea5e9", tags: ["React Native", "TailwindCSS", "NodeJS"] },
  { name: "MERN Stack - Twitter clone", logo: "T", color: "#1da1f2", tags: ["React.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - Google Drive clone", logo: "GD", color: "#fbbc04", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
  { name: "Next.js - LinkedIn clone", logo: "in", color: "#0077b5", tags: ["Next.js", "TailwindCSS", "NodeJS"] },
];

/* ================= TAG COLORS ================= */

const tagColors: Record<Tag, string> = {
  "React.js": "#1d4ed8",
  "Next.js": "#374151",
  "TailwindCSS": "#0e7490",
  "NodeJS": "#166534",
  "React Native": "#0369a1",
};

/* ================= COMPONENT ================= */

export function LoyihalarPage() {
  const { colors, isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <section className="pt-28 pb-20 px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              color: "#a78bfa",
            }}
          >
            🚀 HAQIQIY AMALIYOT
          </motion.div>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold"
            style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
              color: colors.text,
              lineHeight: 1.25,
            }}
          >
            Nazariyadan
          </motion.h1>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="font-bold"
            style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
              background: "linear-gradient(90deg, #22d3ee, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.25,
            }}
          >
            amaliyotga o'tamiz
          </motion.h1>

          <div className="flex items-center justify-center gap-2 text-sm font-medium mt-9"
            style={{ color: colors.textMuted }}
          >
            <Monitor size={16} className="text-purple-400" />
            <span>
              Jami <strong style={{ color: colors.text }}>{projects.length} ta</strong> amaliy loyiha
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {projects.map((p: Project, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{
                y: -6,
                boxShadow: isDark
                  ? "0 20px 40px rgba(0,0,0,0.5)"
                  : "0 20px 40px rgba(0,0,0,0.1)",
              }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >

              <div className="px-4 py-4">
                <p className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
                  {p.name}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag: Tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs text-white"
                      style={{ background: tagColors[tag] }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
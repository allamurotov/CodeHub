import { Github, Layers, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import sardorImage from "@/imports/image.jpg";

const techStack = ["React", "Next.js", "Node.js", "TypeScript", "TailwindCSS", "PostgresQL", "Docker"];

export function BoglanishPage() {
  const { colors, isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: colors.bg }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <section className="pt-28 md:pt-32 pb-24 px-5 md:px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold mb-6 tracking-widest"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}
            >
              <Send size={12} /> DASTURCHI BILAN
            </motion.div>

            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-bold leading-none"
                style={{ fontSize: "clamp(2.2rem,5.5vw,4rem)", color: colors.text }}
              >
                Dasturchi bilan
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="font-bold"
                style={{
                  fontSize: "clamp(2.2rem,5.5vw,4rem)",
                  background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                bog'laning
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-lg mx-auto text-base leading-relaxed mb-8"
              style={{ color: colors.textMuted }}
            >
              Full-stack dasturchi Sardor Allamurotov. Savol, taklif yoki hamkorlik bo'yicha bemalol murojaat qiling.
            </motion.p>

            <motion.a
              href="https://github.com/allamurotov"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.55)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
                boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}
            >
              <Github size={15} />
              GitHub da kuzatish
            </motion.a>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Developer info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl p-7 md:p-8 flex flex-col"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = isDark
                  ? "0 16px 48px rgba(124,58,237,0.15)"
                  : "0 16px 48px rgba(124,58,237,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isDark
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.06)";
              }}
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.3)", "0 0 40px rgba(124,58,237,0.5)", "0 0 20px rgba(124,58,237,0.3)"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <img src={sardorImage} alt="Sardor Allamurotov" className="w-full h-full object-cover" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: colors.text }}>Sardor Allamurotov</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs" style={{ color: colors.textMuted }}>Full-stack developer</span>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: colors.textMuted }}>
                Zamonaviy web texnologiyalar asosida yuqori sifatli raqamli mahsulotlar yaratishga ixtisoslashgan dasturchi. 
                Foydalanuvchi tajribasi va kod sifati har doim birinchi o'rinda.
              </p>

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Layers size={12} style={{ color: colors.textSubtle }} />
                  <span className="text-xs font-medium tracking-wider" style={{ color: colors.textSubtle }}>TEXNOLOGIYALAR</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: isDark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.08)",
                        color: "#a78bfa",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="mt-auto rounded-2xl p-4 grid grid-cols-3 gap-3"
                style={{ background: colors.surface2, border: `1px solid ${colors.border}` }}
              >
                {[
                  { value: "5+", label: "Loyihalar" },
                  { value: "3+", label: "Yillik tajriba" },
                  { value: "7+", label: "Texnologiyalar" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-base font-bold" style={{ color: colors.text }}>{value}</p>
                    <p className="text-[10px] leading-tight mt-0.5" style={{ color: colors.textMuted }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* GitHub */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl p-7 md:p-8 flex flex-col items-center justify-center text-center"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = isDark
                  ? "0 16px 48px rgba(124,58,237,0.15)"
                  : "0 16px 48px rgba(124,58,237,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isDark
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.06)";
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(124,58,237,0.1)" }}
              >
                <Github size={28} style={{ color: "#a78bfa" }} />
              </div>
              <h2 className="text-lg font-bold mb-2" style={{ color: colors.text }}>GitHub</h2>
              <p className="text-sm mb-6 max-w-xs" style={{ color: colors.textMuted }}>
                Loyihalar va ochiq kodlar bilan tanishish uchun GitHub profilimga tashrif buyuring.
              </p>
              <motion.a
                href="https://github.com/allamurotov"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                }}
              >
                <Github size={15} />
                Profilni ko'rish
                <ExternalLink size={13} />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
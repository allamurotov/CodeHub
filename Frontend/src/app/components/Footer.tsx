import { GraduationCap, Github } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { colors, isDark } = useTheme();

  return (
    <footer style={{ background: colors.bg, borderTop: `1px solid ${colors.border}` }}>
      {/* Yangiliklardan xabardor bo'ling */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 py-16 text-center"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
          Yangiliklardan xabardor bo'ling ✨
        </h3>
        <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: colors.textMuted }}>
          Yangi kurslar, bepul loyihalar va IT sohasidagi so'nggi yangiliklarni kuzatib boring.
        </p>
        <motion.a
          href="https://github.com/allamurotov"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(124,58,237,0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
            boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
          }}
        >
          <Github size={17} />
          GitHub da kuzatish
        </motion.a>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <span className="font-semibold text-xl" style={{ color: colors.text }}>CodeHub</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: colors.textMuted }}>
            Zamonaviy usulda dasturlashni o'rganing. Real loyihalar, ochiq kodlar va sifatli ta'lim bir joyda mujassam. Kelajakni biz bilan quring.
          </p>
          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/allamurotov"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              <Github size={16} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="font-semibold mb-4" style={{ color: colors.text }}>Platforma</h4>
          <ul className="space-y-3">
            {[
              { label: "Kurslar", page: "kurslar" },
              { label: "Loyihalar", page: "loyihalar" },
              { label: "Kod manbalar", page: "manbalar" },
            ].map((item) => (
              <li key={item.page}>
                <motion.button
                  onClick={() => onNavigate(item.page)}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: colors.textMuted }}
                  whileHover={{ x: 4, color: "#a78bfa" }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-semibold mb-4" style={{ color: colors.text }}>Qoidalar</h4>
          <ul className="space-y-3">
            {["Foydalanish shartlari", "Maxfiylik siyosati", "Ko'p beriladigan savollar", "Dasturchi bilan bog'lanish"].map((item, i) => (
              <li key={item}>
                <motion.button
                  onClick={() => i === 3 ? onNavigate("boglanish") : undefined}
                  className="text-sm block"
                  style={{ color: colors.textMuted }}
                  whileHover={{ x: 4, color: isDark ? "#fff" : "#0a0a14" }}
                  transition={{ duration: 0.15 }}
                >
                  {item}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div
        className="px-6 py-5 text-center text-xs"
        style={{ borderTop: `1px solid ${colors.border}`, color: colors.textSubtle }}
      >
        © 2026 CodeHub. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}

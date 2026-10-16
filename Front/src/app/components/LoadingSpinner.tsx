import { motion } from "motion/react";

export function LoadingSpinner({ text = "Yuklanmoqda..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-t-transparent"
        style={{ borderColor: "rgba(124,58,237,0.3)", borderTopColor: "#7c3aed" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <span className="text-sm" style={{ color: "#9ca3af" }}>{text}</span>
    </div>
  );
}

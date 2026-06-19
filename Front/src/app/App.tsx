import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { EnrolledCoursesProvider } from "./context/EnrolledCoursesContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { KurslarPage } from "./components/KurslarPage";
import { LoyihalarPage } from "./components/LoyihalarPage";
import { ManbalarPage } from "./components/ManbalarPage";
import { DashboardPage } from "./components/DashboardPage";
import { BoglanishPage } from "./components/BoglanishPage";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22 } },
};

function AppInner() {
  const [page, setPage] = useState("home");
  const { colors } = useTheme();

  const handleNavigate = (p: string) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDashboard = page === "dashboard";

  const renderPage = () => {
    switch (page) {
      case "kurslar": return <KurslarPage onNavigate={handleNavigate} />;
      case "loyihalar": return <LoyihalarPage />;
      case "manbalar": return <ManbalarPage />;
      case "dashboard": return <DashboardPage onNavigate={handleNavigate} />;
      case "boglanish": return <BoglanishPage />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1a1a22",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            borderRadius: "16px",
            padding: "14px 20px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
        }}
      />
      {!isDashboard && <Navbar currentPage={page} onNavigate={handleNavigate} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {!isDashboard && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EnrolledCoursesProvider>
          <AppInner />
        </EnrolledCoursesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { createContext, useContext, useState, ReactNode } from "react";

interface Course {
  name: string;
  progress: number;
  color: string;
  bg: string;
  label: string;
}

interface EnrolledCoursesContextValue {
  courses: Course[];
  addCourse: (name: string) => void;
}

const courseStyles: Record<string, { color: string; bg: string; label: string }> = {
  "React.js": { color: "#61dafb", bg: "#0d1f2d", label: "Re" },
  "Vue.js": { color: "#42b883", bg: "#0f1f14", label: "Vu" },
  "Angular": { color: "#dd0031", bg: "#1f0d0d", label: "An" },
  "Next.js": { color: "#ffffff", bg: "#111", label: "Nx" },
  "Node.js": { color: "#539e43", bg: "#0f1a0d", label: "Nd" },
  "TypeScript": { color: "#3178c6", bg: "#0d2137", label: "TS" },
  "React Native": { color: "#61dafb", bg: "#0d1f2d", label: "RN" },
  "NestJS": { color: "#e0234e", bg: "#1d0d12", label: "Nj" },
  "MongoDB": { color: "#00ed64", bg: "#0d1f14", label: "DB" },
};

const EnrolledCoursesContext = createContext<EnrolledCoursesContextValue>({
  courses: [],
  addCourse: () => {},
});

export function EnrolledCoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);

  const addCourse = (name: string) => {
    setCourses((prev) => {
      if (prev.some((c) => c.name === name)) return prev;
      const style = courseStyles[name] || { color: "#7c3aed", bg: "#1a0d2e", label: name.slice(0, 2) };
      return [...prev, { name, progress: 0, ...style }];
    });
  };

  return (
    <EnrolledCoursesContext.Provider value={{ courses, addCourse }}>
      {children}
    </EnrolledCoursesContext.Provider>
  );
}

export const useEnrolledCourses = () => useContext(EnrolledCoursesContext);

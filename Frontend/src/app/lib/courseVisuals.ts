export interface CourseVisual {
  text: string;
  gradient: string;
  shadow: string;
  accent: string;
}

export const courseVisuals: Record<string, CourseVisual> = {
  "React.js": { text: "React", gradient: "linear-gradient(135deg, #61dafb, #20232a)", shadow: "0 8px 32px rgba(97,218,251,0.3)", accent: "#61dafb" },
  "Vue.js": { text: "Vue", gradient: "linear-gradient(135deg, #42b883, #35495e)", shadow: "0 8px 32px rgba(66,184,131,0.3)", accent: "#42b883" },
  "Angular": { text: "Angular", gradient: "linear-gradient(135deg, #dd0031, #c3002f)", shadow: "0 8px 32px rgba(221,0,49,0.3)", accent: "#dd0031" },
  "Next.js": { text: "Next", gradient: "linear-gradient(135deg, #ffffff, #000000)", shadow: "0 8px 32px rgba(255,255,255,0.15)", accent: "#ffffff" },
  "Node.js": { text: "Node", gradient: "linear-gradient(135deg, #539e43, #333333)", shadow: "0 8px 32px rgba(83,158,67,0.3)", accent: "#539e43" },
  "TypeScript": { text: "TypeScript", gradient: "linear-gradient(135deg, #3178c6, #235a97)", shadow: "0 8px 32px rgba(49,120,198,0.3)", accent: "#3178c6" },
  "React Native": { text: "RN", gradient: "linear-gradient(135deg, #61dafb, #7c3aed)", shadow: "0 8px 32px rgba(97,218,251,0.3)", accent: "#61dafb" },
  "NestJS": { text: "Nest", gradient: "linear-gradient(135deg, #e0234e, #111111)", shadow: "0 8px 32px rgba(224,35,78,0.3)", accent: "#e0234e" },
  "MongoDB": { text: "MongoDB", gradient: "linear-gradient(135deg, #00ed64, #10a546)", shadow: "0 8px 32px rgba(0,237,100,0.3)", accent: "#00ed64" },
};

export const defaultCourseVisual: CourseVisual = {
  text: "",
  gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
  shadow: "0 8px 32px rgba(124,58,237,0.3)",
  accent: "#7c3aed",
};

export function getCourseVisual(title: string): CourseVisual {
  return courseVisuals[title] ?? { ...defaultCourseVisual, text: title };
}

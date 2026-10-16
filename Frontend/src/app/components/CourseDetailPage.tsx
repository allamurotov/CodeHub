import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Circle, FileText, PlayCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

interface Material {
  id: string;
  title: string;
  fileUrl: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  materials: Material[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  lessons: Lesson[];
  isEnrolled: boolean;
  completedLessonIds: string[];
}

interface CourseDetailPageProps {
  courseId: string;
  onNavigate: (p: string, data?: unknown) => void;
}

export function CourseDetailPage({ courseId, onNavigate }: CourseDetailPageProps) {
  const { colors, isDark } = useTheme();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    api
      .get<CourseDetail>(`/courses/${courseId}`)
      .then(async (res) => {
        if (!res.data) return;
        setCourse(res.data);
        setActiveLessonId(res.data.lessons[0]?.id ?? null);
        setCompletedIds(new Set(res.data.completedLessonIds));
        if (!res.data.isEnrolled) {
          await api.post(`/courses/${courseId}/enroll`).catch(() => {});
        }
      })
      .catch(() => toast.error("Kursni yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const toggleLessonComplete = async (lessonId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });
    try {
      await api.post(`/lessons/${lessonId}/complete`);
    } catch (e) {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
        return next;
      });
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.textMuted }}>
        Yuklanmoqda...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: colors.bg, color: colors.textMuted }}>
        <p>Kurs topilmadi</p>
        <button onClick={() => onNavigate("kurslar")} className="text-sm underline">Kurslarga qaytish</button>
      </div>
    );
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId) ?? null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: colors.bg }}>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => onNavigate("kurslar")}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: colors.textMuted }}
        >
          <ArrowLeft size={14} /> Kurslarga qaytish
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>{course.title}</h1>
          {course.description && <p className="text-sm mb-4" style={{ color: colors.textMuted }}>{course.description}</p>}
          {course.lessons.length > 0 && (
            <div className="max-w-xs">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: colors.textMuted }}>{completedIds.size}/{course.lessons.length} dars bajarildi</span>
                <span className="font-semibold" style={{ color: colors.text }}>
                  {Math.round((completedIds.size / course.lessons.length) * 100)}%
                </span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: colors.surface2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedIds.size / course.lessons.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-1.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #22d3ee)" }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {course.lessons.length === 0 ? (
          <p className="text-sm" style={{ color: colors.textMuted }}>Bu kursga hali darslar qo'shilmagan.</p>
        ) : (
          <div className="grid md:grid-cols-[1fr_280px] gap-6">
            <div className="rounded-2xl overflow-hidden" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
              {activeLesson?.videoUrl ? (
                <video key={activeLesson.id} src={activeLesson.videoUrl} controls className="w-full aspect-video bg-black" />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center" style={{ background: colors.surface2, color: colors.textMuted }}>
                  Video mavjud emas
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="font-semibold" style={{ color: colors.text }}>{activeLesson?.title}</h2>
                  {activeLesson && (
                    <button
                      onClick={() => toggleLessonComplete(activeLesson.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
                      style={{
                        background: completedIds.has(activeLesson.id) ? "rgba(34,197,94,0.15)" : colors.surface2,
                        color: completedIds.has(activeLesson.id) ? "#22c55e" : colors.textMuted,
                      }}
                    >
                      {completedIds.has(activeLesson.id) ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {completedIds.has(activeLesson.id) ? "Bajarildi" : "Bajarildi deb belgilash"}
                    </button>
                  )}
                </div>
                {activeLesson?.description && (
                  <p className="text-sm mb-4" style={{ color: colors.textMuted }}>{activeLesson.description}</p>
                )}
                {activeLesson && activeLesson.materials.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium" style={{ color: colors.textMuted }}>Materiallar</p>
                    {activeLesson.materials.map((m) => (
                      <a
                        key={m.id}
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                        style={{ background: colors.surface2, color: colors.text }}
                      >
                        <FileText size={14} /> {m.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-fit" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
              {course.lessons.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonId(l.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  style={{
                    background: l.id === activeLessonId ? (isDark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.1)") : "transparent",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {completedIds.has(l.id) ? (
                    <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
                  ) : (
                    <PlayCircle size={16} style={{ color: l.id === activeLessonId ? "#a78bfa" : colors.textMuted }} />
                  )}
                  <span className="text-sm" style={{ color: l.id === activeLessonId ? "#a78bfa" : colors.text }}>
                    {i + 1}. {l.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

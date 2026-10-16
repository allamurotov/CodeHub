import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ChevronDown, Plus, Trash2, FileText, Video as VideoIcon, Pencil } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../lib/api";

interface Material {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  order: number;
  materials: Material[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  _count: { lessons: number };
}

interface CourseDetail extends Course {
  lessons: Lesson[];
}

interface CoursesResponse {
  courses: Course[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function AdminCoursesPage() {
  const { colors, isDark } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<CoursesResponse>("/courses/admin?page=1&limit=50")
      .then((res) => res.data && setCourses(res.data.courses))
      .catch(() => toast.error("Kurslarni yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(id);
    try {
      const res = await api.get<CourseDetail>(`/courses/${id}`);
      if (res.data) setDetail(res.data);
    } catch {
      toast.error("Kurs tafsilotlarini yuklab bo'lmadi");
    }
  };

  const refreshDetail = async (id: string) => {
    const res = await api.get<CourseDetail>(`/courses/${id}`);
    if (res.data) setDetail(res.data);
    load();
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Kursni butunlay o'chirmoqchimisiz? Barcha darslar va materiallar ham o'chadi.")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Kurs o'chirildi");
      if (expandedId === id) { setExpandedId(null); setDetail(null); }
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Kurslar</h1>
          <p className="text-sm" style={{ color: colors.textMuted }}>Kurslar, darslar va materiallarni boshqarish.</p>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
        >
          <Plus size={16} /> Yangi kurs
        </button>
      </motion.div>

      {showCreate && (
        <CourseForm
          onDone={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="space-y-3 mt-4">
        {loading ? (
          <p className="text-sm" style={{ color: colors.textMuted }}>Yuklanmoqda...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm" style={{ color: colors.textMuted }}>Hali kurs qo'shilmagan.</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="rounded-2xl overflow-hidden" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-4 px-5 py-4">
                <div
                  className="w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: colors.surface2 }}
                >
                  {c.coverImage ? (
                    <img src={c.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <VideoIcon size={14} style={{ color: colors.textMuted }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{c.title}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{c._count.lessons} dars</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: c.published ? "#22c55e22" : "#6b728022", color: c.published ? "#22c55e" : "#6b7280" }}
                >
                  {c.published ? "Nashr etilgan" : "Qoralama"}
                </span>
                <button
                  onClick={() => deleteCourse(c.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400"
                  style={{ background: isDark ? "rgba(248,113,113,0.1)" : "rgba(248,113,113,0.08)" }}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => toggleExpand(c.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: colors.surface2, color: colors.text }}
                >
                  <ChevronDown size={16} style={{ transform: expandedId === c.id ? "rotate(180deg)" : undefined, transition: "transform .2s" }} />
                </button>
              </div>

              {expandedId === c.id && detail && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-5">
                  <div className="rounded-xl p-4 space-y-4" style={{ background: colors.surface2 }}>
                    <CourseForm course={detail} onDone={() => refreshDetail(c.id)} />

                    <div className="pt-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                      <p className="text-xs font-medium mb-2 mt-3" style={{ color: colors.textMuted }}>Darslar</p>
                      <div className="space-y-2">
                        {detail.lessons.map((l) => (
                          <LessonRow key={l.id} lesson={l} courseId={c.id} onChanged={() => refreshDetail(c.id)} />
                        ))}
                      </div>
                      <LessonForm courseId={c.id} onDone={() => refreshDetail(c.id)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CourseForm({ course, onDone, onCancel }: { course?: Course; onDone: () => void; onCancel?: () => void }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [published, setPublished] = useState(course?.published ?? false);
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const isEdit = !!course;

  const submit = async () => {
    if (!title.trim()) { toast.error("Sarlavha kiriting"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("published", String(published));
      if (cover) fd.append("cover", cover);

      if (isEdit) {
        await api.upload(`/courses/${course!.id}`, fd, "PATCH");
        toast.success("Kurs yangilandi");
      } else {
        await api.upload("/courses", fd, "POST");
        toast.success("Kurs yaratildi");
        setTitle(""); setDescription(""); setPublished(false); setCover(null);
      }
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={isEdit ? "" : "rounded-2xl p-4 mb-2"} style={isEdit ? undefined : { background: colors.surface, border: `1px solid ${colors.border}` }}>
      {!isEdit && <p className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Yangi kurs</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kurs nomi"
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          className="text-xs"
          style={{ color: colors.textMuted }}
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tavsif"
        rows={2}
        className="w-full mt-3 px-3 py-2 rounded-lg text-sm"
        style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
      />
      <div className="flex items-center gap-4 mt-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: colors.text }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Nashr etilsin (foydalanuvchilarga ko'rinadi)
        </label>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={submit}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
        >
          {isEdit ? <Pencil size={12} /> : <Plus size={12} />} {isEdit ? "Saqlash" : "Yaratish"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: colors.surface, color: colors.textMuted, border: `1px solid ${colors.border}` }}>
            Bekor qilish
          </button>
        )}
      </div>
    </div>
  );
}

function LessonForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) { toast.error("Dars nomini kiriting"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (video) fd.append("video", video);
      await api.upload(`/courses/${courseId}/lessons`, fd, "POST");
      toast.success("Dars qo'shildi");
      setTitle(""); setDescription(""); setVideo(null); setOpen(false);
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium"
        style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
      >
        <Plus size={12} /> Dars qo'shish
      </button>
    );
  }

  return (
    <div className="rounded-xl p-3 mt-3" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Dars nomi"
        className="w-full px-3 py-2 rounded-lg text-sm mb-2"
        style={{ background: colors.surface2, color: colors.text, border: `1px solid ${colors.border}` }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tavsif"
        rows={2}
        className="w-full px-3 py-2 rounded-lg text-sm mb-2"
        style={{ background: colors.surface2, color: colors.text, border: `1px solid ${colors.border}` }}
      />
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="text-xs mb-2" style={{ color: colors.textMuted }} />
      <div className="flex gap-2">
        <button onClick={submit} disabled={saving} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}>
          Saqlash
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: colors.textMuted }}>
          Bekor qilish
        </button>
      </div>
    </div>
  );
}

function LessonRow({ lesson, courseId, onChanged }: { lesson: Lesson; courseId: string; onChanged: () => void }) {
  const { colors, isDark } = useTheme();
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const deleteLesson = async () => {
    if (!confirm("Darsni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/lessons/${lesson.id}`);
      toast.success("Dars o'chirildi");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await api.delete(`/materials/${id}`);
      toast.success("Material o'chirildi");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    }
  };

  const addMaterial = async () => {
    if (!materialFile) { toast.error("Fayl tanlang"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", materialTitle || materialFile.name);
      fd.append("file", materialFile);
      await api.upload(`/lessons/${lesson.id}/materials`, fd, "POST");
      toast.success("Material qo'shildi");
      setMaterialTitle(""); setMaterialFile(null); setShowMaterialForm(false);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg p-3" style={{ background: colors.surface }}>
      <div className="flex items-center gap-3">
        <VideoIcon size={14} style={{ color: lesson.videoUrl ? "#7c3aed" : colors.textMuted }} />
        <span className="flex-1 text-sm" style={{ color: colors.text }}>{lesson.title}</span>
        <button
          onClick={() => setShowMaterialForm((s) => !s)}
          className="text-xs px-2 py-1 rounded-md"
          style={{ background: colors.surface2, color: colors.textMuted }}
        >
          + Material
        </button>
        <button
          onClick={deleteLesson}
          className="w-7 h-7 flex items-center justify-center rounded-md text-red-400"
          style={{ background: isDark ? "rgba(248,113,113,0.1)" : "rgba(248,113,113,0.08)" }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {lesson.materials.length > 0 && (
        <div className="mt-2 ml-6 space-y-1">
          {lesson.materials.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-xs" style={{ color: colors.textMuted }}>
              <FileText size={12} />
              <a href={m.fileUrl} target="_blank" rel="noreferrer" className="underline">{m.title}</a>
              <button onClick={() => deleteMaterial(m.id)} className="text-red-400">o'chirish</button>
            </div>
          ))}
        </div>
      )}

      {showMaterialForm && (
        <div className="mt-2 ml-6 flex flex-wrap items-center gap-2">
          <input
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
            placeholder="Material nomi"
            className="px-2 py-1 rounded-md text-xs"
            style={{ background: colors.surface2, color: colors.text, border: `1px solid ${colors.border}` }}
          />
          <input type="file" onChange={(e) => setMaterialFile(e.target.files?.[0] ?? null)} className="text-xs" style={{ color: colors.textMuted }} />
          <button onClick={addMaterial} disabled={saving} className="text-xs px-2 py-1 rounded-md text-white disabled:opacity-50" style={{ background: "#7c3aed" }}>
            Yuklash
          </button>
        </div>
      )}
    </div>
  );
}

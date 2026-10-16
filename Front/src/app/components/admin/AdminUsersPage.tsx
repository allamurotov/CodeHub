import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ChevronDown, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
  isVerified: boolean;
  createdAt: string;
}

interface UsersResponse {
  users: AdminUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const ALL_PERMISSIONS = [
  { key: "MANAGE_ADMINS", label: "Adminlarni boshqarish" },
  { key: "MANAGE_CONTENT", label: "Kurs/video/material boshqarish" },
  { key: "MANAGE_USERS", label: "Foydalanuvchilarni boshqarish" },
];

export function AdminUsersPage() {
  const { colors, isDark } = useTheme();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<AdminUser["role"]>("USER");
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = me?.role === "SUPER_ADMIN";
  const canEditRoles = isSuperAdmin || (me?.permissions.includes("MANAGE_ADMINS") ?? false);
  const canDeleteUsers = isSuperAdmin || (me?.permissions.includes("MANAGE_USERS") ?? false);
  const assignablePermissions = isSuperAdmin ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter((p) => p.key !== "MANAGE_ADMINS");

  const load = (p: number) => {
    setLoading(true);
    api
      .get<UsersResponse>(`/admin/users?page=${p}&limit=10`)
      .then((res) => {
        if (res.data) {
          setUsers(res.data.users);
          setTotalPages(res.data.pagination.totalPages);
        }
      })
      .catch(() => toast.error("Foydalanuvchilarni yuklab bo'lmadi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const startEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setDraftRole(u.role);
    setDraftPermissions(u.permissions);
  };

  const togglePermission = (key: string) => {
    setDraftPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const saveRole = async (id: string) => {
    setSaving(true);
    try {
      await api.patch(`/admin/users/${id}/role`, { role: draftRole, permissions: draftRole === "USER" ? [] : draftPermissions });
      toast.success("Yangilandi");
      setEditingId(null);
      load(page);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Bu foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("O'chirildi");
      load(page);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    }
  };

  const roleBadge = (role: AdminUser["role"]) => {
    const map: Record<AdminUser["role"], { label: string; color: string }> = {
      USER: { label: "User", color: "#6b7280" },
      ADMIN: { label: "Admin", color: "#7c3aed" },
      SUPER_ADMIN: { label: "Super Admin", color: "#f59e0b" },
    };
    const s = map[role];
    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: `${s.color}22`, color: s.color }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Foydalanuvchilar</h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>Ro'yxatdan o'tgan foydalanuvchilar va admin ruxsatlari.</p>
      </motion.div>

      <div className="rounded-2xl overflow-hidden" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
        {loading ? (
          <p className="p-6 text-sm" style={{ color: colors.textMuted }}>Yuklanmoqda...</p>
        ) : (
          users.map((u) => (
            <div key={u.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-4 px-5 py-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{u.name}</p>
                  <p className="text-xs truncate" style={{ color: colors.textMuted }}>{u.email}</p>
                </div>
                {roleBadge(u.role)}
                {canEditRoles && (
                  <button
                    onClick={() => (editingId === u.id ? setEditingId(null) : startEdit(u))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: colors.surface2, color: colors.text }}
                  >
                    Boshqarish <ChevronDown size={14} style={{ transform: editingId === u.id ? "rotate(180deg)" : undefined }} />
                  </button>
                )}
                {canDeleteUsers && u.id !== me?.id && u.role !== "SUPER_ADMIN" && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400"
                    style={{ background: isDark ? "rgba(248,113,113,0.1)" : "rgba(248,113,113,0.08)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {editingId === u.id && canEditRoles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-5 pb-5"
                >
                  <div className="rounded-xl p-4 space-y-3" style={{ background: colors.surface2 }}>
                    <div>
                      <label className="text-xs font-medium block mb-1.5" style={{ color: colors.textMuted }}>Rol</label>
                      <select
                        value={draftRole}
                        onChange={(e) => setDraftRole(e.target.value as AdminUser["role"])}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
                      </select>
                    </div>

                    {draftRole !== "USER" && (
                      <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: colors.textMuted }}>Ruxsatlar</label>
                        <div className="space-y-1.5">
                          {assignablePermissions.map((p) => (
                            <label key={p.key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: colors.text }}>
                              <input
                                type="checkbox"
                                checked={draftPermissions.includes(p.key)}
                                onChange={() => togglePermission(p.key)}
                              />
                              {p.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => saveRole(u.id)}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
                      >
                        Saqlash
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: colors.surface, color: colors.textMuted, border: `1px solid ${colors.border}` }}
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40"
            style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            Oldingi
          </button>
          <span className="text-xs" style={{ color: colors.textMuted }}>{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40"
            style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            Keyingi
          </button>
        </div>
      )}
    </div>
  );
}

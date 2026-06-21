import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoggedIn: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    const tokens = api.getTokens();
    if (tokens.refreshToken) {
      api.post("/auth/logout", { refreshToken: tokens.refreshToken }).catch(() => {});
    }
    api.clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    const tokens = api.getTokens();
    if (tokens.accessToken) {
      api.get<{ id: string; name: string; email: string; avatar?: string; role: string }>("/auth/profile")
        .then((res) => {
          if (res.data) setUser(res.data);
        })
        .catch(() => {
          api.clearTokens();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => { setUser(null); api.clearTokens(); };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "OAUTH_SUCCESS") {
        api.setTokens(e.data.accessToken, e.data.refreshToken);
        api.get<{ id: string; name: string; email: string; avatar?: string; role: string }>("/auth/profile")
          .then((res) => {
            if (res.data) setUser(res.data);
          });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/login", { email, password });
    if (!res.data) throw new Error("Login failed");
    api.setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/register", { name, email, password });
    if (!res.data) throw new Error("Registration failed");
    api.setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

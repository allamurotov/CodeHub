const BASE_URL = "/api/v1";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getTokens() {
  try {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");
    return { accessToken: at, refreshToken: rt };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { accessToken } = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let json: ApiResponse<T>;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : { success: false, message: "Empty response" };
  } catch {
    throw new ApiError("Server error: invalid response", res.status);
  }

  if (!res.ok) {
    if (res.status === 401 && endpoint !== "/auth/refresh") {
      const { refreshToken } = getTokens();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshText = await refreshRes.text();
          const refreshJson = refreshText ? JSON.parse(refreshText) : null;
          if (refreshRes.ok && refreshJson?.data) {
            setTokens(refreshJson.data.accessToken, refreshJson.data.refreshToken);
            headers["Authorization"] = `Bearer ${refreshJson.data.accessToken}`;
            const retryRes = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
            const retryText = await retryRes.text();
            const retryJson = retryText ? JSON.parse(retryText) : null;
            if (!retryRes.ok) throw new ApiError(retryJson?.message || "Request failed", retryRes.status);
            return retryJson;
          }
        } catch {
          clearTokens();
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      }
    }
    throw new ApiError(json.message || "Request failed", res.status);
  }

  return json;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  setTokens,
  clearTokens,
  getTokens,
};

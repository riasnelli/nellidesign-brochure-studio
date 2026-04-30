// Backend API client. Targets PHP endpoints under /api on Hostinger.

export const API_BASE = "/api";
const TOKEN_KEY = "gatewayhub_token";
const CSRF_KEY = "gatewayhub_csrf";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getCsrf = () => localStorage.getItem(CSRF_KEY);

export const setSession = (token: string, csrf: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CSRF_KEY, csrf);
};

export const clearSession = () => {
  // Wipe every place a credential could linger
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CSRF_KEY);
  try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
  try { sessionStorage.removeItem(CSRF_KEY); } catch {}
};

// Back-compat exports (older code paths)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = clearSession;

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const csrf = getCsrf();
  const isWrite = (opts.method || "GET").toUpperCase() !== "GET";

  const headers: Record<string, string> = {
    ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isWrite && csrf ? { "X-CSRF-Token": csrf } : {}),
    ...((opts.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, credentials: "same-origin" });

  // Auto-clear on auth failure so the user is bounced back to /gatewayhub
  if (res.status === 401 || res.status === 403) {
    clearSession();
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type Brochure = {
  title: string;
  slug: string;
  category: string;
  thumbnail?: string;
  pdf?: string;
  order?: number;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; csrfToken: string; expiresIn: number }>("/login.php", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  list: () => request<Brochure[]>("/brochures.php"),
  create: (form: FormData) =>
    request<Brochure>("/brochures.php?action=create", { method: "POST", body: form }),
  update: (slug: string, form: FormData) =>
    request<Brochure>(`/brochures.php?action=update&slug=${encodeURIComponent(slug)}`, {
      method: "POST",
      body: form,
    }),
  remove: (slug: string) =>
    request<void>(`/brochures.php?action=delete&slug=${encodeURIComponent(slug)}`, {
      method: "POST",
    }),
  reorder: (slugs: string[]) =>
    request<void>("/brochures.php?action=reorder", {
      method: "POST",
      body: JSON.stringify({ slugs }),
    }),
};

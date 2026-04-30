// Backend API client. Points to PHP endpoints living under /api on Hostinger.
// In dev (Lovable preview) the backend doesn't exist, so requests will fail —
// that's expected. Once deployed to Hostinger with the /api PHP files in place,
// everything works.

export const API_BASE = "/api";
const TOKEN_KEY = "gatewayhub_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((opts.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
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
    request<{ token: string }>("/login.php", {
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

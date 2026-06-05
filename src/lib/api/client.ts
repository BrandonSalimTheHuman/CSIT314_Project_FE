import { supabase } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Error thrown for non-2xx backend responses; carries the HTTP status. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch wrapper for the FastAPI backend.
 *
 * - Prefixes NEXT_PUBLIC_API_URL.
 * - Attaches the current Supabase access token as a Bearer header.
 * - Sets JSON content-type for object bodies, but leaves FormData alone so
 *   the browser can set the multipart boundary.
 * - Throws ApiError (with parsed `detail`) on non-2xx; returns parsed JSON
 *   otherwise (undefined for 204).
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in environment.");
  }

  const headers = new Headers(options.headers);
  const auth = await authHeader();
  for (const [key, value] of Object.entries(auth)) {
    headers.set(key, value);
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = (await res.json()) as { detail?: string };
      detail = data?.detail ?? detail;
    } catch {
      // non-JSON error body — keep statusText
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

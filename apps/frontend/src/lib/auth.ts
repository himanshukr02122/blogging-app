import { User, UserRole } from "@/app/types/blog";

export type SignUpPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

type RequestOptions = {
  method?: string;
  payload?: unknown;
  token?: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.payload ? JSON.stringify(options.payload) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data.detail === "string"
        ? data.detail
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export function persistSession(session: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_KEY, session.access_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    clearSession();
    return null;
  }
}

export function signUp(payload: SignUpPayload) {
  return request<AuthResponse>("/auth/sign-up", {
    method: "POST",
    payload,
  });
}

export function login(payload: LoginPayload) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    payload,
  });
}

export function getCurrentUser(token: string) {
  return request<User>("/auth/me", { token });
}

export function logoutRequest(token: string | null) {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
    token,
  });
}

export function isAdmin(user: User | null): user is User & { role: UserRole } {
  return user?.role === "admin";
}

import { apiRequest, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/apiClient";
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

// ✅ Session management
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

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
}

// ✅ API calls
export function signUp(payload: SignUpPayload) {
  return apiRequest<AuthResponse>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiRequest<User>("/auth/me");
}

export function logoutRequest() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export function isAdmin(user: User | null): user is User & { role: UserRole } {
  return user?.role === "admin";
}

export function healthCheck() {
  return apiRequest<{ status: "ok" }>("/health", {
    cache: "no-store",
  });
}
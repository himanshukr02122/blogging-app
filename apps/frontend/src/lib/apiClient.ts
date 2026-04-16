import { clearSession } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// ✅ Get token safely
function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

// ✅ Handle unauthorized globally
function handleUnauthorized() {
    if (typeof window === "undefined") return;
    clearSession();
    // redirect to login
    window.location.href = "/login?reason=session_expired";
}

// ✅ Main API request
export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.detail || "Something went wrong";

        // 🔥 Handle expired/invalid token
        if (response.status === 401) {
            handleUnauthorized();
        }

        throw new ApiError(message, response.status);
    }

    return data as T;
}
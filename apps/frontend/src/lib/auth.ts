export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, payload: AuthPayload): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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

export function signUp(
  payload: Required<Pick<AuthPayload, "name" | "email" | "password">>
) {
  return request<AuthResponse>("/auth/sign-up", payload);
}

export function login(payload: Pick<AuthPayload, "email" | "password">) {
  return request<AuthResponse>("/auth/login", payload);
}

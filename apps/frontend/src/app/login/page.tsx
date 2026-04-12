"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useAppContext } from "@/contexts/AppProvider";
import { login } from "@/lib/auth";

const Login = () => {
  const router = useRouter();
  const { setSession } = useAppContext();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await login(form);
      setSession(response);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex h-screen-minus-header items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-semibold">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or username"
            value={form.identifier}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          New users can still create an account from the{" "}
          <Link className="text-blue-600 underline dark:text-blue-50" href="/sign-up">
            sign up
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Login;
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/ui/Buttons";
import { useAppContext } from "@/contexts/AppProvider";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    router.push("/login");
  };

  const initials = currentUser?.username.slice(0, 2).toUpperCase() ?? "U";
  const actionHref = currentUser?.role === "admin" ? "/admin/reviews" : "/dashboard";
  const actionLabel = currentUser?.role === "admin" ? "Review Blogs" : "Create Blog";

  return (
    <nav className="fixed top-0 z-12 flex h-18 w-full justify-between border-b bg-gray-100 p-4 dark:bg-gray-900 lg:px-12">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className={`link ${pathname === "/" ? "active" : ""}`}>
            Blogs
          </Link>

          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className={`link ${pathname === "/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          ) : null}

          {currentUser?.role === "admin" ? (
            <>
              <Link
                href="/admin/reviews"
                className={`link ${pathname === "/admin/reviews" ? "active" : ""}`}
              >
                Review Queue
              </Link>
              <Link
                href="/admin/users"
                className={`link ${pathname === "/admin/users" ? "active" : ""}`}
              >
                Users
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href={actionHref}>
                <Button>{actionLabel}</Button>
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-1 pr-4 shadow-sm transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {initials}
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser?.username}
                    </span>
                    <span className="block text-xs capitalize text-gray-500 dark:text-gray-300">
                      {currentUser?.role}
                    </span>
                  </span>
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 top-14 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentUser?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        {currentUser?.email}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                      <Link
                        href={actionHref}
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                      >
                        {actionLabel}
                      </Link>

                      {currentUser?.role === "admin" ? (
                        <Link
                          href="/admin/users"
                          onClick={() => setIsMenuOpen(false)}
                          className="rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          Manage Users
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              {pathname !== "/login" ? (
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

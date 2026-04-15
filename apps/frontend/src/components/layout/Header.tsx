"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import Button from "@/components/ui/Buttons";
import { useAppContext } from "@/contexts/AppProvider";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
    setIsMobileNavOpen(false);
    await logout();
    router.push("/login");
  };

  const initials = currentUser?.username.slice(0, 2).toUpperCase() ?? "U";

  const isAdmin = currentUser?.role === "admin";

  // 👉 Primary CTA
  const actionHref = isAdmin ? "/admin/reviews" : "/dashboard";
  const actionLabel = isAdmin ? "Review Blogs" : "Create Blog";

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-gray-100 dark:bg-gray-900 h-16">
      <div className="flex items-center justify-between px-4 py-3 lg:px-12 h-full">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
          >
            ☰
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            <Link href="/" className={`link ${pathname === "/" ? "active" : ""}`}>
              Blogs
            </Link>

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`link ${pathname === "/dashboard" ? "active" : ""}`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* PRIMARY ACTION */}
              <Link href={actionHref}>
                <Button className="hidden sm:block">{actionLabel}</Button>
              </Link>

              {/* AVATAR MENU */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border bg-white p-1 dark:bg-gray-800 hover:border-blue-300 transition"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {initials}
                  </span>

                  <span className="text-sm font-medium">
                    {currentUser?.username}
                  </span>

                  {/* 👇 important UX fix */}
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg dark:bg-gray-800">
                    <div className="border-b px-3 py-2">
                      <p className="text-sm font-medium">
                        {currentUser?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.email}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                      
                      {/* ADMIN ONLY */}
                      {isAdmin && (
                        <Link
                          href="/admin/users"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Manage Users
                        </Link>
                      )}

                      {/* LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 text-sm text-left text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            pathname !== "/login" && (
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            )
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-3">
          <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
            Blogs
          </Link>

          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)}>
              Dashboard
            </Link>
          )}

          {/* PRIMARY ACTION also visible in mobile */}
          {isAuthenticated && (
            <Link href={actionHref} onClick={() => setIsMobileNavOpen(false)} className="sm:hidden">
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
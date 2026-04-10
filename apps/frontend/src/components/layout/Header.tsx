"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Buttons";

const Header = () => {

  const pathname = usePathname();

  return (
    <nav
      className="p-4 h-18 flex justify-between fixed top-0 w-full z-12 bg-gray-100 dark:bg-gray-900 border-b lg:px-12"
    >
        <div
          className="flex justify-between w-full"
        >
          <div
            className="flex gap-2.5 items-center"
          >
            <Link 
              href="/groww-sliding-ui"
              className={`link ${pathname === '/groww-sliding-ui' ? 'active' : ''}`}
            >
              Groww Sliding UI
            </Link>
            <Link 
              href="/"
              className={`link ${pathname === '/' ? 'active' : ''}`}
            >
              Blogs
            </Link>
          </div>
          {!["/login", "/sign-up"].includes(pathname) && (<Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>)}
        </div>
    </nav>
  )
}

export default Header
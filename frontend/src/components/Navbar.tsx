"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signInWithGoogle, logOut } from "../firebase/auth";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "MyBooks", path: "/mybooks" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-[var(--background-90)] border-b border-[var(--foreground-15)] sticky top-0 backdrop-blur-md mb-16 z-40">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="absolute inset-y-0 left-0 flex sm:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            >
              <span className="sr-only">Toggle main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="block size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="block size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/images/logo-full.png"
                alt="Readoo"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex px-3 py-2 text-sm rounded transition ${
pathname === link.path
? "text-[var(--color)]"
: "text-[var(--foreground-40)] hover:text-[var(--color)]"
}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ThemeToggle />
            <div className="relative ml-3" ref={menuRef}>
              {user ? (
                <>
                  <button
                    id="user-menu-button"
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 cursor-pointer"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="rounded-full object-cover"
                      src={user.photoURL || "/images/person-placeholder.png"}
                      alt="User Avatar"
                      width={32}
                      height={32}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      role="menu"
                      aria-labelledby="user-menu-button"
                      className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-[rgb(var(--background-rgb))] py-1 ring-1 ring-[var(--foreground-15)]"
                    >
                      <a
                        id="user-menu-item-0"
                        role="menuitem"
                        href="#"
                        tabIndex={0}
                        className="block px-4 py-2 text-sm text-[var(--color)] hover:bg-[var(--foreground-07)] transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        MyBooks
                      </a>
                      <button
                        id="user-menu-item-2"
                        role="menuitem"
                        tabIndex={0}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[var(--foreground-07)] cursor-pointer transition"
                        onClick={() => {
                          logOut();
                          setUserMenuOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                  // logged-out
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 ps-3 pe-4 py-2 bg-sky-700 text-white text-sm rounded hover:bg-sky-800 cursor-pointer"
                  >
                    <Image
                      src="/images/person-placeholder.png"
                      alt="Default Avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    Sign in
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <div className="space-y-0">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex px-3 py-2 text-md rounded transition ${
pathname === link.path
? "text-[var(--color)]"
: "text-[var(--foreground-40)] hover:text-[var(--color)]"
}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

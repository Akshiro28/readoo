'use client';

import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="bg-white border-b border-[var(--foreground-10)] sticky top-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            >
              <span className="sr-only">Toggle main menu</span>
              {!isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="block size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="block size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          <div className="h-full flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Readoo"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block h-full">
              <div className="h-full flex space-x-6 items-center">
                <a href="#" className="flex h-full items-center px-1 py-2 text-sm border-b-2 text-gray-800 border-sky-800">Dashboard</a>
                <a href="#" className="flex h-full items-center px-1 py-2 text-sm border-b-2 border-white text-gray-500 hover:text-gray-600 hover:border-gray-300">Team</a>
                <a href="#" className="flex h-full items-center px-1 py-2 text-sm border-b-2 border-white text-gray-500 hover:text-gray-600 hover:border-gray-300">Projects</a>
                <a href="#" className="flex h-full items-center px-1 py-2 text-sm border-b-2 border-white text-gray-500 hover:text-gray-600 hover:border-gray-300">Calendar</a>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3" ref={menuRef}>
              <button
                id="user-menu-button"
                type="button"
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 cursor-pointer"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="size-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt=""
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  aria-labelledby="user-menu-button"
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 ring-[var(--foreground-10)]"
                >
                  <a
                    id="user-menu-item-0"
                    role="menuitem"
                    href="#"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    id="user-menu-item-1"
                    role="menuitem"
                    href="#"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    id="user-menu-item-2"
                    role="menuitem"
                    href="#"
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Dashboard</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Team</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Projects</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white">Calendar</a>
          </div>
        </div>
      )}
    </nav>
  );
}

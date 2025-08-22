"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[rgb(var(--background-rgb))] border-t border-[var(--foreground-15)] mt-16">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="w-full absolute inset-y-0 left-0 flex items-center">
            <div className="h-full text-sm font-medium flex flex-col sm:flex-row flex-1 items-center justify-center sm:justify-between text-center md:text-start">
              <p>
                © 2025{" "}
                <Link href="/" className="hover:underline underline-offset-4">
                  Readoo
                </Link>
                . All Rights Reserved.
              </p>

              <a
                href="https://github.com/Akshiro28/readoo"
                className="hover:underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                View project on GitHub →
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

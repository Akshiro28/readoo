'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--foreground-15)] mt-16">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="w-full absolute inset-y-0 left-0 flex items-center">

            <div className="h-full text-sm font-medium flex flex-1 items-center justify-center sm:justify-between">
              <p>© 2025 <a href="https://github.com/Akshiro28" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Akshiro</a>. All Rights Reserved.</p>

              <a href="https://github.com/Akshiro28/readoo" className="hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer">View project on GitHub →</a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

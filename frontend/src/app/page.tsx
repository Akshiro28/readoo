"use client";

import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/carousel/slide1.png",
    heading: "Welcome to Readoo!",
    text: "Dive into a world of books! Search, filter, and explore titles you love, then curate your own list by favouriting and tracking what you've read.",
    color: "rgba(99, 195, 169, 0.1)",
  },
  {
    image: "/carousel/slide2.png",
    heading: "Discover Your Next Read",
    text: (
      <>
        <p className="text-lg mb-5">
          Search, filter, and sort through a wide library to find your next great read.
        </p>
        <Link href="/explore" className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
          Explore →
        </Link>
      </>
    ),
    color: "rgba(108, 177, 228, 0.1)",
  },
  {
    image: "/carousel/slide3.png",
    heading: "Your Personal Book List",
    text: (
      <>
        <p className="text-lg mb-5">
          Track books you&apos;ve read, save favourites, and curate your own library.
        </p>
        <Link href="/mybooks" className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
          MyBooks →
        </Link>
      </>
    ),
    color: "rgba(246, 167, 183, 0.1)",
  },
];

type Stats = {
  totalUsers: number;
  totalSavedBooks: number;
  averageBooks: string;
};

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ImageCarousel slides={slides} />

      <div className="h-10 w-4 border border-[var(--color)] mx-auto mt-7 rounded-full py-1">
        <div className="w-2 h-2 bg-[var(--color)] mx-auto rounded-full scroll-down-ball"></div>
      </div>

      <div className="mt-24 border border-[var(--foreground-15)] grid grid-cols-2 rounded-4xl">
        <div className="p-16">
          <div className="space-y-2">
            {Array(2).fill(null).map((_, idx) => (
              <div key={`bottom-line-${idx}`} className="flex items-center h-8">
                <div className="w-full border-t border-[var(--foreground-15)]" />
              </div>
            ))}

            {["Explore", "Your", "Next", "Read"].map((line, idx) => (
              <div key={idx} className="flex items-center h-8">
                <div className="basis-[16%] border-t border-[var(--foreground-15)]" />
                <span className="px-3 text-left whitespace-nowrap text-3xl">{line}</span>
                <div className="flex-grow border-t border-[var(--foreground-15)]" />
              </div>
            ))}

            {Array(5).fill(null).map((_, idx) => (
              <div key={`bottom-line-${idx}`} className="flex items-center h-8">
                <div className="w-full border-t border-[var(--foreground-15)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-16 border-l border-[var(--foreground-15)]">
          <h2 className="text-3xl font-semibold mb-4">
            Discover Your Next Read
          </h2>
          <p className="mb-4">
            Search, filter, and sort through a wide library to find your next great read.
          </p>
          <Link href="/explore" className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
            Explore →
          </Link>
        </div>
      </div>

      <div className="mt-49 mb-49 border border-[var(--foreground-15)] grid grid-cols-2 rounded-4xl">
        <div className="p-16">
          <h2 className="text-3xl font-semibold mb-4">
            Curate your personal books list
          </h2>
          <p className="mb-4">
            Track books you&apos;ve read, save favourites, and curate your own library.
          </p>
          <Link href="/mybooks" className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
            MyBooks →
          </Link>
        </div>

        <div className="border-l border-[var(--foreground-15)] flex flex-col">
          <div className="p-16 flex-1 flex items-center justify-between text-3xl font-semibold before:content-['→']">
            <div className="text-end">
              <p>{stats?.totalUsers ?? "—"}</p>
              <p>Total registered users</p>
            </div>
          </div>

          <div className="p-16 flex-1 flex items-center justify-between border-t border-[var(--foreground-15)] text-3xl font-semibold before:content-['→']">
            <div className="text-end">
              <p>{stats?.totalSavedBooks ?? "—"}</p>
              <p>Total saved books</p>
            </div>
          </div>

          <div className="p-16 flex-1 flex items-center justify-between border-t border-[var(--foreground-15)] text-3xl font-semibold before:content-['→']">
            <div className="text-end">
              <p>{stats?.averageBooks ?? "—"}</p>
              <p>Average books per user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

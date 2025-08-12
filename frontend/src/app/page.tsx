"use client";

import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import GenreMarquee from "../components/GenreMarquee/GenreMarquee";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookshelfSvgMyBooks from '../components/BookshelfSvgMyBooks';
import BookshelfSvgExplore from '../components/BookshelfSvgExplore';

const slides = [
  {
    image: "/images/readoo.svg",
    heading: "Welcome to Readoo!",
    text: "Dive into a world of books! Search, filter, and explore titles you love, then curate your own list by favouriting and tracking what you've read",
    color: "rgba(99, 195, 169, 0.1)",
    border: "rgba(99, 195, 169, 1)",
  },
  {
    image: "/images/explore-book.svg",
    heading: "Discover Your Next Read",
    text: (
      <>
        <p className="text-lg mb-6">
          Search, filter, and sort through a wide library to find your next
          great read!
        </p>
        <Link
          href="/explore"
          className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition"
        >
          Explore →
        </Link>
      </>
    ),
    color: "rgba(108, 177, 228, 0.1)",
    border: "rgba(108, 177, 228, 1)",
  },
  {
    image: "images/my-books.svg",
    heading: "Your Personal Book List",
    text: (
      <>
        <p className="text-lg mb-6">
          Track books you&apos;ve read, save favourites, and curate your own
          library
        </p>
        <Link
          href="/mybooks"
          className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition"
        >
          MyBooks →
        </Link>
      </>
    ),
    color: "rgba(246, 167, 183, 0.1)",
    border: "rgba(246, 167, 183, 1)",
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
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ImageCarousel slides={slides} />

        <div className="h-10 w-4 border border-[var(--color)] mx-auto mt-7 rounded-full py-1">
          <div className="w-2 h-2 bg-[var(--color)] mx-auto rounded-full scroll-down-ball"></div>
        </div>
      </div>

      <div className="triangle-wrapper mt-8">
        <div className="triangle-border"></div>
        <div className="triangle-background"></div>
      </div>

      <div className="bg-[var(--foreground-04-non-transparent)] pb-32 pt-8 z-1 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <BookshelfSvgExplore
            style={{
              width: '100vw',
              maxWidth: '400px',
              display: 'block',
              margin: '0 auto',
            }}
          />
          <div className="border border-[var(--foreground-15)] grid grid-cols-2 mt-12 mb-32 rounded-4xl bg-[rgb(var(--background-rgb))]">
            <div className="p-16">
              <div className="space-y-2">
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
              </div>
            </div>

            <div className="p-16 border-l border-[var(--foreground-15)]">
              <h2 className="text-3xl font-semibold mb-4">
                Discover Your Next Read
              </h2>
              <p className="mb-6">
                Dive into a rich collection of books across every genre and interest! Whether you&apos;re looking for trending titles, hidden gems, or timeless classics, our database has it all listed and ready to explore.
              </p>
              <Link
                href="/explore"
                className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>

        <BookshelfSvgMyBooks
          style={{
            width: '100vw',
            maxWidth: '400px',
            display: 'block',
            margin: '0 auto',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[rgb(var(--background-rgb))] mt-12 border border-[var(--foreground-15)] grid grid-cols-2 rounded-4xl">
            <div className="p-16">
              <h2 className="text-3xl font-semibold mb-4">
                Curate your personal books list
              </h2>
              <p className="mb-6">
                Build your own personal bookshelf with ease. Keep track of what you’ve read, save your favorite titles, and organize books the way you like. Whether you’re a casual reader or a dedicated bookworm, your curated library is always just a click away.
              </p>
              <Link
                href="/mybooks"
                className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition"
              >
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
      </div>

      <div className="triangle-wrapper">
        <div className="triangle-border-reverse"></div>
        <div className="triangle-background-reverse"></div>
      </div>
    </>
  );
}

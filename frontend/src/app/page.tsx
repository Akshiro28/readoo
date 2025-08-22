"use client";

import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import GenreMarquee from "../components/GenreMarquee/GenreMarquee";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookshelfSvgMyBooks from '../components/BookshelfSvgMyBooks';
import BookshelfSvgExplore from '../components/BookshelfSvgExplore';
import { Trophy, BookOpen, Heart, Bookmark, UserPlus, Library, Search } from "lucide-react";
import { signInWithGoogle, logOut } from "../firebase/auth";
import { useAuth } from "../hooks/useAuth";

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
        <p className="mb-6">
          Search, filter, and sort through a wide library to find your next
          great read!
        </p>
        <Link
          href="/explore"
          className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition inline-flex items-center gap-2 w-full md:w-fit justify-center"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5" />
          Explore
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
        <p className="mb-6">
          Track books you&apos;ve read, save favourites, and curate your own
          library
        </p>
        <Link
          href="/mybooks"
          className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition inline-flex items-center gap-2 w-full md:w-fit justify-center"
        >
          <Library className="w-4 h-4 md:w-5 md:h-5" />
          MyBooks
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
  const { user } = useAuth();

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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <ImageCarousel slides={slides} />

        <div className="h-10 w-4 border border-[var(--color)] mx-auto mt-7 rounded-full py-1">
          <div className="w-2 h-2 bg-[var(--color)] mx-auto rounded-full scroll-down-ball"></div>
        </div>
      </section>

      <div className="triangle-wrapper mt-8">
        <div className="triangle-border"></div>
        <div className="triangle-background"></div>
      </div>

      <section className="bg-[var(--foreground-04-non-transparent)] pb-32 pt-8 z-1 relative">
        <BookshelfSvgExplore
          style={{
            width: '80vw',
            maxWidth: '400px',
            display: 'block',
            margin: '0 auto',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border border-[var(--foreground-15)] grid md:grid-cols-2 mt-12 mb-32 rounded-3xl md:rounded-4xl bg-[rgb(var(--background-rgb))]">
            <div className="p-16 hidden md:block">
              <div className="space-y-2">
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
                <GenreMarquee direction="left" />
                <GenreMarquee direction="right" />
              </div>
            </div>

            <div className="p-10 md:p-16 md:border-l md:border-[var(--foreground-15)]">
              <h2 className="text-3xl font-semibold mb-4">
                Discover Your Next Read
              </h2>
              <p className="mb-6">
                Dive into a rich collection of books across every genre and interest! Whether you&apos;re looking for trending titles, hidden gems, or timeless classics, our database has it all listed and ready to explore.
              </p>
              <Link
                href="/explore"
                className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition inline-flex items-center gap-2 w-full justify-center md:w-fit"
              >
                <Search className="w-4 h-4" />
                Explore
              </Link>
            </div>
          </div>
        </div>

        <BookshelfSvgMyBooks
          style={{
            width: '80vw',
            maxWidth: '400px',
            display: 'block',
            margin: '0 auto',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[rgb(var(--background-rgb))] mt-12 border border-[var(--foreground-15)] grid md:grid-cols-2 rounded-4xl">
            <div className="p-10 md:p-16">
              <h2 className="text-3xl font-semibold mb-4">
                Curate your personal books list
              </h2>
              <p className="mb-6">
                Build your own personal bookshelf with ease. Keep track of what you’ve read, save your favorite titles, and organize books the way you like. Whether you’re a casual reader or a dedicated bookworm, your curated library is always just a click away.
              </p>
              <Link
                href="/mybooks"
                className="px-4 py-2 rounded bg-sky-700 text-white hover:bg-sky-800 transition inline-flex items-center gap-2 w-full justify-center md:w-fit"
              >
                <Library className="w-4 h-4" />
                MyBooks
              </Link>
            </div>

            <div className="border-l border-[var(--foreground-15)] flex flex-col hidden md:block">
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
      </section>

      <div className="triangle-wrapper">
        <div className="triangle-border-reverse"></div>
        <div className="triangle-background-reverse"></div>
      </div>

      <section className="py-32 md:py-42">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take on the <span className="text-sky-700">Reading Challenge</span>
          </h2>

          <p className="max-w-2xl mx-auto mb-10">
            Clear goals, track your progress, and celebrate your reading achievements.
            Stay consistent, stay curious, and watch your bookshelf grow!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-green-600" />}
              title="Read More"
              desc="Stay on track with yearly reading goals"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-red-500" />}
              title="Favorites"
              desc="Collect and cherish the books you love the most"
            />
            <FeatureCard
              icon={<Bookmark className="w-8 h-8 text-blue-500" />}
              title="Wishlist"
              desc="Never lose sight of the books you want to read next"
            />
          </div>

          <Link
            href="/mybooks"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-medium transition justify-center w-full md:w-fit"
          >
            <Trophy className="w-5 h-5" />
            Start Your Challenge
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-sky-700 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Reading Journey Today!
          </h2>
          <p className="text-white max-w-2xl mx-auto mb-10">
            Create your myBooks profile,
            clear challenges, and track your progress!
            Browse a wide library of books and keep track of what you&apos;ve read, favorited, and added to your wishlist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/mybooks" : "#"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-gray-200 text-sky-700 font-semibold transition justify-center"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  signInWithGoogle();
                }
              }}
            >
              {user ? (
                <Library className="w-5 h-5" />
              ) : (
                  <UserPlus className="w-5 h-5" />
                )}
              {user ? "Go to MyBooks" : "Create an Account"}
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold transition justify-center"
            >
              <Search className="w-5 h-5" />
              Explore Library
            </Link>
          </div>
        </div>
      </section>
    </>
  );

  function FeatureCard({
    icon,
    title,
    desc,
  }: {
      icon: React.ReactNode;
      title: string;
      desc: string;
    }) {
    return (
      <div className="p-6 bg-[var(--foreground-04)] border border-[var(--foreground-15)] rounded-2xl transition flex flex-col items-center text-center hover:scale-104">
        <div className="mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[var(--foreground-70)]">{desc}</p>
      </div>
    );
  }
}

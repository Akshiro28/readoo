"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import BookCard from "../../components/BookCard";
import { getIdToken } from "firebase/auth";

type BookType = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

type BookEntry = {
  bookId: string;
  status: {
    read?: boolean;
    favorite?: boolean;
    wishlist?: boolean;
  };
};

type BookWithStatus = BookType & {
  status: {
    read?: boolean;
    favorite?: boolean;
    wishlist?: boolean;
  };
};

export default function MyBooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BookWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "favorite" | "wishlist">("all");
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchMyBooks = async () => {
      try {
        const token = await getIdToken(user);
        const res = await fetch("/api/my-books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const bookDetails = await Promise.all(
          data.map(async (entry: BookEntry) => {
            try {
              const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${entry.bookId}`);
              const json = await res.json();

              // if Google API limit reached or data invalid, skip
              if (!json || !json.volumeInfo) return null;

              return {
                id: json.id,
                volumeInfo: json.volumeInfo,
                status: entry.status || {},
              };
            } catch {
              return null;
            }
          })
        );

        const validBooks = bookDetails.filter((b): b is BookWithStatus => b !== null);
        setBooks(validBooks);
      } catch (err) {
        console.error("Failed to fetch my books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user]);

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.volumeInfo?.title?.toLowerCase().includes(searchTitle.toLowerCase()) ?? false;
    const authorMatch = book.volumeInfo?.authors?.some((a) =>
      a.toLowerCase().includes(searchAuthor.toLowerCase())
    ) ?? false;

    const matchesSearch =
      (searchTitle === "" || titleMatch) &&
        (searchAuthor === "" || authorMatch);

    const status = book.status || {};
    const matchesStatus =
      statusFilter === "all" ||
        (statusFilter === "read" && status.read) ||
        (statusFilter === "favorite" && status.favorite) ||
        (statusFilter === "wishlist" && status.wishlist);

    const yearStr = book.volumeInfo?.publishedDate?.slice(0, 4);
    const year = yearStr ? parseInt(yearStr) : null;

    const matchesYear =
      (minYear === null || (year !== null && year >= minYear)) &&
        (maxYear === null || (year !== null && year <= maxYear));

    return matchesSearch && matchesStatus && matchesYear;
  });

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Books</h1>

      {!user ? (
        <p className="mb-8 text-center">Sign in to start customizing your own books list!</p>
      ) : loading ? (
        <p className="mb-8 text-center">Loading your books...</p>
      ) : null}    

      {!loading && (
        <>
          <div className="flex flex-col md:flex-row gap-2 mb-2 justify-center">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-1/3 border-[var(--foreground-15)] outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
            />

            <input
              type="text"
              placeholder="Search by author..."
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-1/3 border-[var(--foreground-15)] outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
            />

            <input
              type="number"
              placeholder="Min year"
              className="w-32 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
              onChange={(e) =>
                setMinYear(e.target.value ? parseInt(e.target.value) : null)
              }
            />
            <input
              type="number"
              placeholder="Max year"
              className="w-32 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
              onChange={(e) =>
                setMaxYear(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </div>

          <div className="flex gap-2 items-center overflow-x-auto justify-center">
            {["all", "read", "favorite", "wishlist"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as "all" | "read" | "favorite" | "wishlist")}
                className={`px-4 py-2 text-sm rounded-md border border-sky-700 text-sky-700 cursor-pointer transition ${
statusFilter === status
? "bg-sky-700 text-white"
: "text-black hover:bg-sky-700/10"
}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredBooks.length > 0 && (
            <p className="my-4 text-sm text-[var(--foreground-30)] text-center">
              Showing {filteredBooks.length} book
              {filteredBooks.length > 1 ? "s" : ""}
            </p>
          )}

          {filteredBooks.length === 0 && (
            <p className="mb-8 text-sm text-[var(--foreground-30)]">No books matched your filters.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {filteredBooks.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}


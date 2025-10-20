"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import BookCard from "../../components/BookCard";
import { getIdToken } from "firebase/auth";
import Stats from "../../components/Stats";

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
    readDate?: string | null; // added
    favorite?: boolean;
    wishlist?: boolean;
  };
};

type BookWithStatus = BookType & {
  status: {
    read?: boolean;
    readDate?: string | null; // added
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
  const [statusFilter, setStatusFilter] = useState<
  "all" | "read" | "favorite" | "wishlist"
>("all");
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
              const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${entry.bookId}`
              );
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

        const validBooks = bookDetails.filter(
          (b): b is BookWithStatus => b !== null
        );
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
    const titleMatch =
      book.volumeInfo?.title
        ?.toLowerCase()
        .includes(searchTitle.toLowerCase()) ?? false;
    const authorMatch =
      book.volumeInfo?.authors?.some((a) =>
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

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const titleA = a.volumeInfo.title || "";
    const titleB = b.volumeInfo.title || "";
    const authorA = a.volumeInfo.authors?.[0] || "";
    const authorB = b.volumeInfo.authors?.[0] || "";
    const yearA = a.volumeInfo.publishedDate || "";
    const yearB = b.volumeInfo.publishedDate || "";

    switch (sortOption) {
      case "title-asc":
        return titleA.localeCompare(titleB);
      case "title-desc":
        return titleB.localeCompare(titleA);
      case "author-asc":
        return authorA.localeCompare(authorB);
      case "author-desc":
        return authorB.localeCompare(authorA);
      case "year-asc":
        return yearA.localeCompare(yearB); // oldest first
      case "year-desc":
        return yearB.localeCompare(yearA); // newest first
      default:
        return 0;
    }
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle, searchAuthor, statusFilter, minYear, maxYear, sortOption]);


  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  const currentBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Current year for filtering
  const currentYear = new Date().getFullYear();

  // Count how many books are read in the current year
  const readThisYearCount = books.filter(
    b =>
      b.status.read &&
        b.status.readDate &&
        new Date(b.status.readDate).getFullYear() === currentYear
  ).length;

  // Count how many books are favorited
  const favoriteCount = books.filter(b => b.status.favorite).length;

  // Count how many books are wishlisted
  const wishlistCount = books.filter(b => b.status.wishlist).length;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <h1 className="text-4xl font-bold mb-8 text-center">My Books</h1>

      <Stats
        readThisYearCount={readThisYearCount}
        favoriteCount={favoriteCount}
        wishlistCount={wishlistCount}
      />

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
        <div className="flex flex-col xs:flex-row gap-2 w-full md:flex-1 justify-center">
          <div className="flex gap-2 justify-center flex-1 xs:flex-0">
            <input
              type="number"
              placeholder="Min year"
              className="w-1/2 xs:w-32 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
              onChange={(e) =>
                setMinYear(e.target.value ? parseInt(e.target.value) : null)
              }
            />
            <input
              type="number"
              placeholder="Max year"
              className="w-1/2 xs:w-32 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
              onChange={(e) =>
                setMaxYear(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
          >
            <option value="">Sort By</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
            <option value="author-asc">Author (A–Z)</option>
            <option value="author-desc">Author (Z–A)</option>
            <option value="year-desc">Year (Newest First)</option>
            <option value="year-asc">Year (Oldest First)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 items-center overflow-x-auto justify-center">
        {["all", "read", "favorite", "wishlist"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(
                status as "all" | "read" | "favorite" | "wishlist"
              )
            }
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

      {!user ? (
        <p className="my-6 text-center">
          Sign in to start customizing your own books list!
        </p>
      ) : loading ? (
          <p className="my-6 text-center">Loading your books...</p>
        ) : null}

      {!loading && (
        <>
          {filteredBooks.length > 0 && (
            <p className="my-6 text-sm text-[var(--foreground-30)] text-center">
              Showing {filteredBooks.length} book
              {filteredBooks.length > 1 ? "s" : ""}
            </p>
          )}

          {books.length === 0 ? (
            <p className="my-6 text-sm text-[var(--color)] text-center">
              You haven&apos;t added any books yet. Start by adding books to
              your list!
            </p>
          ) : filteredBooks.length === 0 ? (
              <p className="my-6 text-sm text-[var(--color)] text-center">
                No books matched your filters.
              </p>
            ) : null}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xs:gap-8 md:gap-12">
            {currentBooks.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded transition cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-[var(--foreground-10)] font-semibold"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

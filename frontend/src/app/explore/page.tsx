"use client";
import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard";

export default function Explore() {
  const [books, setBooks] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [debouncedAuthor, setDebouncedAuthor] = useState(author);
  const [loading, setLoading] = useState(false);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedAuthor(author), 500);
    return () => clearTimeout(timeout);
  }, [author]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedQuery && !debouncedAuthor) {
        setBooks([]);
        return;
      }

      setLoading(true);
      try {
        const queryParts = [];
        if (debouncedQuery.trim()) queryParts.push(`intitle:${debouncedQuery.trim()}`);
        if (debouncedAuthor.trim()) queryParts.push(`inauthor:${debouncedAuthor.trim()}`);
        const finalQuery = queryParts.join("+");

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(finalQuery)}&maxResults=30`
        );
        const data = await res.json();

        const uniqueBooks = Array.from(
          new Map((data.items || []).map((item: any) => [item.id, item])).values()
        );

        setBooks(uniqueBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedQuery, debouncedAuthor]);

  const filteredBooks = books.filter((item) => {
    const info = item.volumeInfo || {};
    const year = parseInt(info.publishedDate?.slice(0, 4));
    if (!year || isNaN(year)) return false;
    if (minYear && year < minYear) return false;
    if (maxYear && year > maxYear) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Explore Books</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-gray-400"
        placeholder="Search by title or keyword..."
      />

      <div className="flex flex-col md:flex-row gap-2 mb-8">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Search by author"
          className="w-full p-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-gray-400"
        />
        <input
          type="number"
          placeholder="Min year"
          className="w-full p-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-gray-400"
          onChange={(e) =>
            setMinYear(e.target.value ? parseInt(e.target.value) : null)
          }
        />
        <input
          type="number"
          placeholder="Max year"
          className="w-full p-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-gray-400"
          onChange={(e) =>
            setMaxYear(e.target.value ? parseInt(e.target.value) : null)
          }
        />
      </div>

      {loading && <p className="mb-8">Loading books...</p>}

      {!loading && books.length > 0 && (
        <p className="mb-4 text-sm text-gray-400">
          Search results<br />
          Showing {filteredBooks.length} books
        </p>
      )}

      {!loading && books.length === 0 && (
        <p className="mb-8 text-sm text-gray-400">No books found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
        {filteredBooks.map((item) => (
          <BookCard key={item.id} book={item} />
        ))}
      </div>
    </main>
  );
}

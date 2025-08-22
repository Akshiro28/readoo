"use client";
import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard";

type BookItem = {
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

export default function Explore() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [debouncedAuthor, setDebouncedAuthor] = useState(author);
  const [loading, setLoading] = useState(false);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [isRecommendation, setIsRecommendation] = useState(false);
  const [sortOption, setSortOption] = useState("");

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
      setLoading(true);
      setIsRecommendation(false);

      try {
        let finalQuery = "";

        const hasQuery = debouncedQuery.trim() !== "";
        const hasAuthor = debouncedAuthor.trim() !== "";

        if (hasQuery || hasAuthor) {
          const queryParts = [];
          if (hasQuery) queryParts.push(`intitle:${debouncedQuery.trim()}`);
          if (hasAuthor) queryParts.push(`inauthor:${debouncedAuthor.trim()}`);
          finalQuery = queryParts.join("+");
        } else {
          const recommendationQueries = [
            // General & Popular
            "bestsellers",
            "trending books",
            "award winning",
            "critically acclaimed",
            "popular reads",
            "must read",
            "staff picks",

            // Genres
            "fiction",
            "non-fiction",
            "fantasy",
            "science fiction",
            "romance",
            "mystery",
            "thriller",
            "historical fiction",
            "graphic novel",
            "young adult",
            "children's books",
            "dystopian",
            "adventure",
            "horror",
            "literary fiction",

            // Thematic
            "self help",
            "personal development",
            "motivation",
            "mindfulness",
            "mental health",
            "productivity",
            "spirituality",
            "philosophy",
            "psychology",

            // Academic & Informative
            "popular science",
            "biology",
            "astronomy",
            "technology",
            "engineering",
            "history",
            "politics",
            "economics",
            "business",
            "finance",
            "true crime",
            "education",

            // Niche interests
            "cookbooks",
            "travel",
            "memoir",
            "biography",
            "essays",
            "anthology",
            "poetry",
            "art",
            "music",
            "photography",
            "nature",
            "animals",
            "parenting",
            "crafts",
            "gardening",

            // Cultural / Identity
            "LGBTQ+",
            "feminism",
            "BIPOC authors",
            "translated literature",
            "Asian authors",
            "African literature",
            "Native American stories",

            // Mood-based
            "feel good books",
            "heartbreaking stories",
            "uplifting reads",
            "books that make you think",
            "funny novels",
            "dark academia",

            // Based on time/events
            "summer reads",
            "holiday books",
            "back to school",
            "new releases",
            "classic novels",
            "books of the year",
            "2024 favorites",

            // Mixed tags
            "booktok",
            "netflix adaptations",
            "reese's book club",
            "nyt bestsellers",
            "goodreads choice awards",
            "underrated gems",
          ];

          const getRandomQuery = () => {
            const randomIndex = Math.floor(
              Math.random() * recommendationQueries.length
            );
            return recommendationQueries[randomIndex];
          };

          finalQuery = getRandomQuery();
          setIsRecommendation(true);
        }

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
finalQuery
)}&maxResults=30`
        );
        const data = await res.json();

        const uniqueBooks = Array.from(
          new Map(
            (data.items || []).map((item: BookItem) => [item.id, item])
          ).values()
        ) as BookItem[];

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
    const year = parseInt(info.publishedDate?.slice(0, 4) || "");
    if (!year || isNaN(year)) return false;
    if (minYear && year < minYear) return false;
    if (maxYear && year > maxYear) return false;
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const infoA = a.volumeInfo || {};
    const infoB = b.volumeInfo || {};

    switch (sortOption) {
      case "title-asc":
        return (infoA.title || "").localeCompare(infoB.title || "");
      case "title-desc":
        return (infoB.title || "").localeCompare(infoA.title || "");
      case "author-asc":
        return (infoA.authors?.[0] || "").localeCompare(
          infoB.authors?.[0] || ""
        );
      case "author-desc":
        return (infoB.authors?.[0] || "").localeCompare(
          infoA.authors?.[0] || ""
        );
      case "year-asc":
        return (
          parseInt(infoA.publishedDate?.slice(0, 4) || "0") -
            parseInt(infoB.publishedDate?.slice(0, 4) || "0")
        );
      case "year-desc":
        return (
          parseInt(infoB.publishedDate?.slice(0, 4) || "0") -
            parseInt(infoA.publishedDate?.slice(0, 4) || "0")
        );
      default:
        return 0;
    }
  });

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Books</h1>

      <div className="flex flex-col md:flex-row gap-2 justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
          placeholder="Search by title..."
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Search by author..."
          className="w-full md:w-1/3 px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)] placeholder:text-[var(--foreground-30)]"
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
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-[var(--foreground-15)] rounded outline-none focus:ring-0 focus:border-[var(--foreground-30)]"
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

      {loading && <p className="my-6 text-center">Loading books...</p>}

      {!loading && books.length > 0 && (
        <p className="my-6 text-sm text-[var(--foreground-30)] text-center">
          {isRecommendation
            ? "Recommended Books"
            : `Showing ${filteredBooks.length} result${
filteredBooks.length !== 1 ? "s" : ""
}`}
        </p>
      )}

      {!loading && books.length === 0 && (
        <p className="my-6 text-sm text-[var(--foreground-30)] text-center">
          No books found.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
        {sortedBooks.map((item) => (
          <BookCard key={item.id} book={item} />
        ))}
      </div>
    </main>
  );
}

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

export default function MyBooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

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
        const bookIds: string[] = data.map((doc: any) => doc.bookId);
        const uniqueBookIds = [...new Set(bookIds)];

        const bookDetails = await Promise.all(
          uniqueBookIds.map(async (id) => {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
            const json = await res.json();
            return json;
          })
        );

        setBooks(bookDetails);
      } catch (err) {
        console.error("Failed to fetch my books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user]);

  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">My Books</h1>

      {loading && <p className="mb-8">Loading your books...</p>}

      {!loading && books.length > 0 && (
        <p className="mb-4 text-sm text-gray-400">
          You've saved {books.length} books
        </p>
      )}

      {!loading && books.length === 0 && (
        <p className="mb-8 text-sm text-gray-400">No books saved yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
        {books.map((item) => (
          <BookCard key={item.id} book={item} />
        ))}
      </div>
    </main>
  );
}


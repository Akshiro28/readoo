"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { CircleCheck, Heart, Bookmark } from "lucide-react";
import { getIdToken } from "firebase/auth";
import { auth } from "../firebase/auth";

export type BookType = {
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

type StatusType = {
  read: boolean;
  favorite: boolean;
  wishlist: boolean;
};

export default function BookCard({ book }: { book: BookType }) {
  const volumeInfo = book.volumeInfo;
  const { user } = useAuth();
  const [status, setStatus] = useState<StatusType>({
    read: false,
    favorite: false,
    wishlist: false,
  });

  const year = volumeInfo.publishedDate?.substring(0, 4) || "Unknown Year";
  const image = volumeInfo.imageLinks?.thumbnail
    ? volumeInfo.imageLinks.thumbnail.replace("&zoom=1", "&zoom=2").replace("http:", "https:")
    : "/images/book-cover-placeholder.png";

  useEffect(() => {
    if (!user || !auth.currentUser) return;

    const fetchStatus = async () => {
      try {
        const token = await getIdToken(auth.currentUser!, true);
        const res = await fetch(`/api/user-books?bookId=${book.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.status) {
            setStatus(data.status);
          }
        } else {
          console.error("Failed to fetch book status");
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, [user, book.id]);

  async function handleMarkAs(key: keyof StatusType) {
    if (!user || !auth.currentUser) return;

    try {
      const token = await getIdToken(auth.currentUser, true);
      const res = await fetch("/api/user-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book.id,
          statusKey: key,
          value: !status[key],
        }),
      });

      if (res.ok) {
        setStatus((prev) => ({ ...prev, [key]: !prev[key] }));
      } else {
        const data = await res.json();
        console.error("Error updating status:", data.error);
      }
    } catch (err) {
      console.error("Failed to update book status:", err);
    }
  }

  return (
    <div className="rounded group">
      <div className="relative w-full aspect-[2/3] mb-3 rounded-md overflow-hidden">
        {user && (
          <div className="absolute top-2.5 left-2.5 flex gap-[4px] z-10 bg-white rounded-full ring-3 ring-white shadow-md">
            {status.read && (
              <span
                className="w-3 h-3 bg-green-600 rounded-full"
                title="Read"
              />
            )}
            {status.favorite && (
              <span
                className="w-3 h-3 bg-red-500 rounded-full"
                title="Favorite"
              />
            )}
            {status.wishlist && (
              <span
                className="w-3 h-3 bg-blue-500 rounded-full"
                title="Wishlist"
              />
            )}
          </div>
        )}

        <Image
          src={image}
          alt={volumeInfo.title || "Book cover"}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {user && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="bg-white rounded p-1 shadow-md"
              title={status.read ? "Unmark as Read" : "Mark as Read"}
              onClick={() => handleMarkAs("read")}
            >
              <CircleCheck
                className={`w-5 h-5 ${
status.read
? "text-white fill-green-600"
: "text-green-600 fill-none"
}`}
              />
            </button>

            <button
              className="bg-white rounded p-1 shadow-md"
              title={status.favorite ? "Remove from Favorites" : "Add to Favorites"}
              onClick={() => handleMarkAs("favorite")}
            >
              <Heart
                className={`w-5 h-5 ${
status.favorite ? "text-red-500 fill-red-500" : "text-red-500"
}`}
              />
            </button>

            <button
              className="bg-white rounded p-1 shadow-md"
              title={status.wishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              onClick={() => handleMarkAs("wishlist")}
            >
              <Bookmark
                className={`w-5 h-5 ${
status.wishlist ? "text-blue-500 fill-blue-500" : "text-blue-500"
}`}
              />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-md font-semibold mb-1 leading-tight">
        {volumeInfo.title || "Untitled"}
      </h3>
      <p className="text-xs text-gray-400 mb-1 leading-tight">
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-xs text-gray-400">{year}</p>
    </div>
  );
}


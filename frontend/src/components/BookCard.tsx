"use client";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { Check, Heart, Bookmark } from "lucide-react";

export type BookItem = {
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

export default function BookCard({ book }: { book: BookItem }) {
  const volumeInfo = book.volumeInfo;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;
  const year = volumeInfo.publishedDate?.substring(0, 4);
  const { user, loading } = useAuth();

  const image = thumbnail
    ? thumbnail.replace("&zoom=1", "&zoom=2").replace("http:", "https:")
    : "/images/book-cover-placeholder.png";

  return (
    <div className="rounded group">
      <div className="relative w-full aspect-[2/3] mb-3 rounded-md overflow-hidden">
        <Image
          src={image}
          alt={volumeInfo.title || "Book cover"}
          fill
          className="object-cover rounded-md"
        />

        {user && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="bg-white rounded p-1 shadow-md cursor-pointer"
              title="Mark as Read"
              onClick={() => handleMarkAs("read", book)}
            >
              <Check className="w-5 h-5 text-green-600" />
            </button>
            <button
              className="bg-white rounded p-1 shadow-md cursor-pointer"
              title="Add to Favorites"
              onClick={() => handleMarkAs("favorite", book)}
            >
              <Heart className="w-5 h-5 text-red-500" />
            </button>
            <button
              className="bg-white rounded p-1 shadow-md cursor-pointer"
              title="Add to Wishlist"
              onClick={() => handleMarkAs("wishlist", book)}
            >
              <Bookmark className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-md font-semibold mb-1 leading-tight">{volumeInfo.title}</h3>
      <p className="text-xs text-gray-400 mb-1 leading-tight">
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-xs text-gray-400">{year}</p>
    </div>
  );
}

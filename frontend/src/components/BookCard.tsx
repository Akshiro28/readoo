"use client";
import Image from "next/image";

// Define a shared BookItem type (you could move this to a types folder)
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

  const image = thumbnail
    ? thumbnail.replace("&zoom=1", "&zoom=2").replace("http:", "https:")
    : "/images/book-cover-placeholder.png";

  return (
    <div className="rounded bg-white">
      <div className="relative w-full aspect-[2/3] mb-3 rounded-md overflow-hidden">
        <Image
          src={image}
          alt={volumeInfo.title || "Book cover"}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <h3 className="text-md font-semibold mb-1">{volumeInfo.title}</h3>
      <p className="text-xs text-gray-400 mb-1">
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-xs text-gray-400">{year}</p>
    </div>
  );
}

export default function BookCard({ book }: { book: any }) {
  const volumeInfo = book.volumeInfo;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;
  const year = volumeInfo.publishedDate?.substring(0, 4);

  const image = thumbnail
    ? thumbnail.replace('&zoom=1', '&zoom=2').replace('http:', 'https:')
    : '/images/book-cover-placeholder.png';

  return (
    <div className="rounded bg-white">
      <img
        src={image}
        alt={volumeInfo.title}
        className="w-full object-cover aspect-[2/3] rounded-md mb-3"
      />
      <h3 className="text-md font-semibold mb-1">{volumeInfo.title}</h3>
      <p className="text-xs text-gray-400 mb-1">
        {volumeInfo.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-xs text-gray-400">{year}</p>
    </div>
  );
}

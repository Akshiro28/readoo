import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import Link from "next/link";

const slides = [
  {
    image: "/carousel/slide1.png",
    heading: "Welcome to Readoo!",
    text: "Dive into a world of books! Search, filter, and explore titles you love, then curate your own list by favouriting and tracking what you've read.",
    color: "#E3F5EF",
  },
  {
    image: "/carousel/slide2.png",
    heading: "Discover Your Next Read",
    text: (
      <>
        <p className="text-lg mb-5">
          Search, filter, and sort through a wide library to find your next great read.
        </p>
        <Link href="/explore" className="px-3 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
          Explore →
        </Link>
      </>
    ),
    color: "#E9F4FD",
  },
  {
    image: "/carousel/slide3.png",
    heading: "Your Personal Book List",
    text: (
      <>
        <p className="text-lg mb-5">
          Track books you've read, save favourites, and curate your own library.
        </p>
        <Link href="/mybooks" className="px-3 py-2 rounded bg-sky-700 text-white hover:bg-sky-800">
          MyBooks →
        </Link>
      </>
    ),
    color: "#FEEBF1",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ImageCarousel slides={slides} />

      <div className="h-10 w-4 border border-gray-800 mx-auto mt-7 rounded-full py-1">
        <div className="w-2 h-2 bg-gray-800 mx-auto rounded-full scroll-down-ball"></div>
      </div>

      <div className="mt-24 border border-[var(--foreground-15)] grid grid-cols-2 min-h-100 rounded-4xl">
        <div className="p-16">
          a
        </div>

        <div className="p-16 border-l border-[var(--foreground-15)]">
          b
        </div>
      </div>
    </div>
  );
}

import ImageCarousel from "../components/ImageCarousel/ImageCarousel";

const slides = [
  {
    image: "/carousel/slide1.png",
    heading: "Welcome to Readoo!",
    text: "Explore a world of books and discover your next great read.",
    color: "#FFF0EA",
  },
  {
    image: "/carousel/slide2.png",
    heading: "Explore Top Books",
    text: (
      <>
        Button here
      </>
    ),
    color: "#e0f7fa",
  },
  {
    image: "/carousel/slide3.png",
    heading: "Find Your Next Favorite",
    color: "#fce4ec",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ImageCarousel slides={slides} />
    </div>
  );
}

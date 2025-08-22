import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BookshelfSvgProps = {
  className?: string;
  style?: React.CSSProperties;
};

const BookshelfSvgMyBooks: React.FC<BookshelfSvgProps> = ({ style }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const viewWidth = 400;
  const viewHeight = 200;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const allBooks = wrapperRef.current.querySelectorAll(".book-green, .book-red, .book-blue");
    const labels = wrapperRef.current.querySelectorAll(".book-label");

    gsap.set(labels, { opacity: 0 });

    gsap.to(allBooks, {
      fill: (_, target) => {
        if (target.classList.contains("book-green")) return "rgba(0,166,62,0.1)";
        if (target.classList.contains("book-red"))   return "rgba(251,44,54,0.1)";
        if (target.classList.contains("book-blue"))  return "rgba(43,127,255,0.1)";
        return "";
      },
      stroke: (_, target) => {
        if (target.classList.contains("book-green")) return "#00a63e";
        if (target.classList.contains("book-red"))   return "#fb2c36";
        if (target.classList.contains("book-blue"))  return "#2b7fff";
        return "";
      },
      duration: 1,
      stagger: 0.2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top 70%",
        toggleActions: "restart none none reverse"
      }
    });

    gsap.to(labels, {
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top 70%",
        toggleActions: "restart none none reverse"
      },
      opacity: 1,
      duration: 1,
      stagger: 0.6,
      ease: "power1.out"
    });
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-fit mx-auto scale-50`">
      <div className="flex gap-8 absolute left-1/2 -translate-x-[50%] text-sm md:text-base" style={{ top: `calc(0.08 * ${viewWidth}px)` }}>
        <div className="flex gap-2 items-center book-label">
          <div className="w-2 h-2 bg-[#00a63e] rounded-[99px]" />
          <p className="text-[#00a63e]">Read</p>
        </div>

        <div className="flex gap-2 items-center book-label">
          <div className="w-2 h-2 bg-[#fb2c36] rounded-[99px]" />
          <p className="text-[#fb2c36]">Favorite</p>
        </div>

        <div className="flex gap-2 items-center book-label">
          <div className="w-2 h-2 bg-[#2b7fff] rounded-[99px]" />
          <p className="text-[#2b7fff]">Wishlist</p>
        </div>
      </div>

      <svg
        style={{
          width: "100vw",
          maxWidth: "400px",
          display: "block",
          margin: "0 auto",
          height: "auto",
          ...style
        }}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        fill="var(--background)"
        stroke="var(--foreground)"
        strokeWidth="2"
      >
        {/* Upright Book (Green) */}
        <rect
          className="book-green"
          x={0.08 * viewWidth}
          y={0.4 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
        />

        {/* Tilted Left Book */}
        <g transform={`rotate(-15 ${0.2 * viewWidth} ${0.75 * viewHeight})`}>
          <rect
            x={0.187 * viewWidth}
            y={0.395 * viewHeight}
            width={0.06 * viewWidth}
            height={0.5 * viewHeight}
          />
        </g>

        {/* Tilted Right Book (Red) */}
        <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
          <rect
            className="book-red"
            x={0.33 * viewWidth}
            y={0.366 * viewHeight}
            width={0.06 * viewWidth}
            height={0.5 * viewHeight}
          />
        </g>

        {/* Upright Book (Blue) */}
        <rect
          className="book-blue"
          x={0.44 * viewWidth}
          y={0.4 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
        />

        {/* Upright Book */}
        <rect
          x={0.5 * viewWidth}
          y={0.4 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
          className="book-blue"
        />

        {/* Tilted Right Book */}
        <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
          <rect
            x={0.58 * viewWidth}
            y={0.23 * viewHeight}
            width={0.06 * viewWidth}
            height={0.5 * viewHeight}
          />
        </g>

        {/* Flat Book Stack */}
        <rect
          x={0.698 * viewWidth}
          y={0.42 * viewHeight}
          width={0.25 * viewWidth}
          height={0.12 * viewHeight}
          className="book-blue"
        />
        <rect
          x={0.723 * viewWidth}
          y={0.54 * viewHeight}
          width={0.25 * viewWidth}
          height={0.12 * viewHeight}
        />
        <rect
          x={0.698 * viewWidth}
          y={0.66 * viewHeight}
          width={0.25 * viewWidth}
          height={0.12 * viewHeight}
          className="book-red"
        />
        <rect
          x={0.683 * viewWidth}
          y={0.78 * viewHeight}
          width={0.25 * viewWidth}
          height={0.12 * viewHeight}
          className="book-green"
        />

        {/* Shelf */}
        <rect
          x={1}
          y={0.9 * viewHeight}
          width={viewWidth - 2}
          height={0.05 * viewHeight}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default BookshelfSvgMyBooks;

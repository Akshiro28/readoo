import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BookshelfSvgProps = {
  className?: string;
  style?: React.CSSProperties;
};

const BookshelfSvgExplore: React.FC<BookshelfSvgProps> = ({ style }) => {
  const viewWidth = 400;
  const viewHeight = 200;
  const magnifierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magnifierRef.current) return;

    gsap.fromTo(
      magnifierRef.current,
      { x: 0.03 * viewWidth },
      {
        x: viewWidth - 0.26 * viewWidth,
        duration: 3.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#bookshelf-svg-container",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none none reset", // OnEnter, OnLeave, OnEnterBack, OnLeaveBack
        },
      }
    );
  }, []);

  return (
    <div
      id="bookshelf-svg-container"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Bookshelf SVG */}
      <svg
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          ...style,
        }}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        fill="var(--background)"
        stroke="var(--foreground)"
        strokeWidth="2"
      >
        {/* Shelf */}
        <rect
          x={1}
          y={0.9 * viewHeight}
          width={viewWidth - 2}
          height={0.05 * viewHeight}
          fill="rgb(var(--background-rgb))"
          stroke="var(--foreground)"
          strokeWidth="2"
        />

        {/* Upright Books */}
        <rect x={0.09 * viewWidth} y={0.4 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />
        <rect x={0.15 * viewWidth} y={0.4 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />
        <rect x={0.21 * viewWidth} y={0.4 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />

        {/* Tilted Left Book */}
        <g transform={`rotate(-15 ${0.2 * viewWidth} ${0.75 * viewHeight})`}>
          <rect x={0.312 * viewWidth} y={0.463 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />
        </g>

        {/* Tilted Right Book */}
        <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
          <rect x={0.755 * viewWidth} y={0.138 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />
        </g>

        {/* Upright Book */}
        <rect x={0.878 * viewWidth} y={0.4 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />

        {/* Tilted Right Book */}
        <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
          <rect x={0.695 * viewWidth} y={0.17 * viewHeight} width={0.06 * viewWidth} height={0.5 * viewHeight} />
        </g>

        {/* Flat Books */}
        <rect x={0.425 * viewWidth} y={0.78 * viewHeight} width={0.25 * viewWidth} height={0.12 * viewHeight} />
        <rect x={0.41 * viewWidth} y={0.66 * viewHeight} width={0.25 * viewWidth} height={0.12 * viewHeight} />
        <rect x={0.45 * viewWidth} y={0.54 * viewHeight} width={0.25 * viewWidth} height={0.12 * viewHeight} />
        <rect x={0.425 * viewWidth} y={0.42 * viewHeight} width={0.25 * viewWidth} height={0.12 * viewHeight} />
      </svg>

      {/* Magnifying Glass */}
      <div
        ref={magnifierRef}
        style={{
          position: "absolute",
          top: "63%",
          left: "0%",
          width: "17%",
          aspectRatio: "1/1",
          borderRadius: "50%",
          border: `3px solid rgb(var(--foreground-rgb))`,
          backdropFilter: "blur(4px) saturate(120%)",
          WebkitBackdropFilter: "blur(8px) saturate(120%)",
          transform: "translateY(-50%) rotate(-45deg)",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      >
        {/* Handle */}
        <div
          style={{
            position: "absolute",
            bottom: "-42%",
            left: "50%",
            width: "10%",
            height: "40%",
            background: "rgb(var(--foreground-rgb))",
            transform: "translateX(-50%)",
            borderRadius: "99px",
          }}
        />
      </div>
    </div>
  );
};

export default BookshelfSvgExplore;

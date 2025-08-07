import React from 'react';

type BookshelfSvgProps = {
  className?: string;
  style?: React.CSSProperties;
};

const BookshelfSvgMyBooks: React.FC<BookshelfSvgProps> = ({ style }) => {
  const viewWidth = 400;
  const viewHeight = 200;

  return (
    <svg
      style={{
        width: '100vw',
        maxWidth: '400px',
        display: 'block',
        margin: '0 auto',
        height: 'auto',
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

      {/* Upright Book */}
      <rect
        x={0.09 * viewWidth}
        y={0.4 * viewHeight}
        width={0.06 * viewWidth}
        height={0.5 * viewHeight}
      />

      {/* Upright Book */}
      <rect
        x={0.15 * viewWidth}
        y={0.4 * viewHeight}
        width={0.06 * viewWidth}
        height={0.5 * viewHeight}
      />

      {/* Upright Book */}
      <rect
        x={0.21 * viewWidth}
        y={0.4 * viewHeight}
        width={0.06 * viewWidth}
        height={0.5 * viewHeight}
      />

      {/* Tilted Left Book */}
      <g transform={`rotate(-15 ${0.2 * viewWidth} ${0.75 * viewHeight})`}>
        <rect
          x={0.312 * viewWidth}
          y={0.463 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
        />
      </g>

      {/* Tilted Right Book */}
      <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
        <rect
          x={0.755 * viewWidth}
          y={0.138 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
        />
      </g>

      {/* Upright Book */}
      <rect
        x={0.878 * viewWidth}
        y={0.4 * viewHeight}
        width={0.06 * viewWidth}
        height={0.5 * viewHeight}
      />

      {/* Tilted Right Book */}
      <g transform={`rotate(15 ${0.32 * viewWidth} ${0.75 * viewHeight})`}>
        <rect
          x={0.695 * viewWidth}
          y={0.17 * viewHeight}
          width={0.06 * viewWidth}
          height={0.5 * viewHeight}
        />
      </g>

      {/* Flat Book */}
      <rect
        x={0.425 * viewWidth}
        y={0.75 * viewHeight}
        width={0.2 * viewWidth}
        height={0.15 * viewHeight}
      />

      {/* Flat Book */}
      <rect
        x={0.41 * viewWidth}
        y={0.6 * viewHeight}
        width={0.2 * viewWidth}
        height={0.15 * viewHeight}
      />

      {/* Flat Book */}
      <rect
        x={0.45 * viewWidth}
        y={0.45 * viewHeight}
        width={0.2 * viewWidth}
        height={0.15 * viewHeight}
      />
    </svg>
  );
};

export default BookshelfSvgMyBooks;

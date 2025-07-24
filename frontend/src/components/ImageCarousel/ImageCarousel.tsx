"use client";

import React, { useState, ReactNode } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./ImageCarousel.module.css";
import Image from "next/image";

interface Slide {
  image: string;
  heading?: string;
  text?: string | ReactNode;
  color?: string;
}

interface ImageCarouselProps {
  slides: Slide[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          transitionTime={800}
          showStatus={false}
          showArrows={false}
          selectedItem={currentIndex}
          onChange={(index) => setCurrentIndex(index)}
          showIndicators={false}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={styles.slideWrapper}
              style={{ "--bg-color": slide.color || "#fff" } as React.CSSProperties}
            >
              {(slide.heading || slide.text) && (
                <div className={styles.overlayGroup}>
                  {slide.heading && <div className={styles.heading}>{slide.heading}</div>}
                  {slide.text && <div className={styles.text}>{slide.text}</div>}
                </div>
              )}

              <div className={styles.imageContainer}>
                <Image
                  src={slide.image}
                  alt={`Slide ${idx + 1}`}
                  className={styles.image}
                  fill
                  priority={idx === 0}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className={styles.indicators}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={currentIndex === idx ? styles.selectedDot : styles.dot}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

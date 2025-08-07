'use client';

import styles from "./GenreMarquee.module.css";
import { useEffect, useState } from "react";

const genreList: string[] = [
  "bestsellers", "trending books", "award winning", "critically acclaimed", "popular reads",
  "must read", "staff picks", "fiction", "non-fiction", "fantasy", "science fiction", "romance",
  "mystery", "thriller", "historical fiction", "graphic novel", "young adult", "children's books",
  "dystopian", "adventure", "horror", "literary fiction", "classic literature", "philosophy",
  "psychology", "self-help", "productivity", "biography", "memoir", "true crime", "short stories",
  "poetry", "essays", "cultural studies", "politics", "economics", "science & nature", "technology",
  "environment", "history", "military history", "feminist literature", "spirituality",
  "religion", "travel", "cookbooks", "art & design", "music", "comics & manga", "satire",
  "anthology", "coming of age", "supernatural", "urban fantasy", "dark academia", "light novels",
  "medical fiction", "legal thriller", "cyberpunk", "steampunk", "noir", "cozy mystery",
  "family saga", "epic fantasy", "space opera", "romantic comedy", "contemporary fiction", "drama",
  "educational", "science journalism",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GenreMarquee({ direction = "left" }: { direction?: "left" | "right" }) {
  const [genres, setGenres] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(160);

  useEffect(() => {
    const shuffled = shuffleArray(genreList);
    setGenres([...shuffled, ...shuffled]);

    const random = Math.floor(Math.random() * (224 - 180 + 1)) + 180;
    setDuration(random);
  }, []);

  return (
    <div className={`${styles.container} ${styles[direction]}`}>
      <div className={styles.gradientLeft}></div>
      <div className={styles.gradientRight}></div>
      <div
        className={styles.track}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {genres.map((genre, index) => (
          <span key={index} className={styles.text}>
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}

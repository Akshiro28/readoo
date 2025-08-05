import styles from "./GenreMarquee.module.css";

const genres: string[] = [
  "bestsellers",
  "trending books",
  "award winning",
  "critically acclaimed",
  "popular reads",
  "must read",
  "staff picks",
  "fiction",
  "non-fiction",
  "fantasy",
  "science fiction",
  "romance",
  "mystery",
  "thriller",
  "historical fiction",
  "graphic novel",
  "young adult",
  "children's books",
  "dystopian",
  "adventure",
  "horror",
  "literary fiction",
];

export default function GenresScroller() {
  const doubledGenres = [...genres, ...genres];

  return (
    <div className={styles.container}>
      <div className={styles.gradientLeft}></div>
      <div className={styles.gradientRight}></div>
      <div className={styles.track}>
        {doubledGenres.map((genre, index) => (
          <span key={index} className={styles.text}>
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}

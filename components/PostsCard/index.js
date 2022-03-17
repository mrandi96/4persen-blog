import Link from 'next/link';
import styles from './PostsCard.module.css';

export default function PostsCard ({ title, description, url }) {
  return <Link href={url}>
    <a
      className={styles.card}
    >
      <h2>{title} &rarr;</h2>
      <p>{description}</p>
    </a>
  </Link>
}


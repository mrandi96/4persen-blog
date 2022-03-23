import Link from 'next/link';
import styles from 'styles/PostsCard.module.css';

export default function PostsCard ({ title, description, url, onClick }) {
  return <div className={styles.card}>
    <Link href={url}>
      <a>
        <h2 className={styles['title']}>{title} &rarr;</h2>
      </a>
    </Link>
    {description.split(';').map((item) => (
      <div onClick={() => onClick(String(item).trim())} className={styles['tags']} key={item}>#{String(item).trim()}</div>
    ))}
  </div>
}


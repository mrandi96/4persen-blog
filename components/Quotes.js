import styles from 'styles/Quotes.module.css';

export default function Quotes ({ text = 'Quote of the day', author = 'Author of the day' }) {
  return (
    <div className={styles.container}>
      <p className={styles.text}>{`${text}`}</p>
      <p className={styles.author}>by {text && !author ? "Anonymous" : author}</p>
    </div>
  )
}
import Link from 'next/link';
import styles from 'styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
    &copy; 2022.&nbsp;
    <Link href="https://www.linkedin.com/in/randi-pratama-b91396191/">
      <a>Muhammad Randi Pratama</a>
    </Link>.
    All Rights Reserved.
  </footer>
  )
}

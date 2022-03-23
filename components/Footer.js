import Link from 'next/link';
import styles from 'styles/Footer.module.css';
import DarkModeToggle from './DarkModeToggle';

export default function Footer({ preComponent }) {
  return (
    <footer className={styles.footer}>
      {preComponent}
      &copy; 2022.&nbsp;
      <Link href="https://www.linkedin.com/in/randi-pratama-b91396191/">
        <a>Muhammad Randi Pratama.</a>
      </Link>
      &nbsp;All Rights Reserved.
    </footer>
  )
}

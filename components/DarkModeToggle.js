import { useState } from 'react';
import styles from 'styles/DarkModeToggle.module.css';
import icons from 'styles/Icons.module.css';

export default function DarkModeToggle({ onClick, isDark, style: extStyle }) {
  return <div className={`${styles.container} ${styles[isDark ? 'dark' : 'light']}`} style={{ ...extStyle }} onClick={onClick}>
    <span className={`${styles['icon']} ${icons[isDark ? 'gg-moon' : 'gg-sun']}`} />
  </div>
}
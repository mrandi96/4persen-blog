import React from 'react';
import styles from './SearchBar.module.css';
import icons from '../../styles/Icons.module.css';

export default function SearchBar ({ style: extStyle, onChange }) {
  return <div className={styles.container} style={{ ...extStyle }}>
    <span className={icons['gg-search']} style={{ marginLeft: 10, marginRight: 3 }} />
    <input
      onChange={onChange}
      className={styles.search}
      type="text"
      name="q"
      placeholder="Search..."
      aria-label="Search term" />
  </div>
}
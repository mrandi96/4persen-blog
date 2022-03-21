import styles from 'styles/SearchBar.module.css';
import icons from 'styles/Icons.module.css';

export default function SearchBar ({ style: extStyle, onChange, value, searchRef, clearSearch, showClear }) {
  return <div className={styles.container} style={{ ...extStyle }}>
    <span className={icons['gg-search']} style={{ marginLeft: 10, marginRight: 3 }} />
    <input
      ref={searchRef}
      value={value}
      onChange={onChange}
      className={styles.search}
      type="text"
      name="q"
      placeholder="Search..."
      autoComplete="off"
      aria-label="Search term" />
    <span
      onClick={clearSearch}
      className={icons['gg-close']}
      style={{
        marginLeft: 3,
        marginRight: 10,
        cursor: 'pointer',
        display: !showClear && 'none',
      }} />
  </div>
}
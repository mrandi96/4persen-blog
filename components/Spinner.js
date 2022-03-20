import styles from 'styles/Spinner.module.css';

export default function Spinner({ show = true }) {
  return (
    <div style={{ display: show ? 'inline-block' : 'none' }} className={styles['lds-ring']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
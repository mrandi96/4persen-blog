import styles from 'styles/LoginPage.module.css';
import icons from 'styles/Icons.module.css';

import { useState } from 'react';
import cookieCutter from 'cookie-cutter';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailChangeHandler = (e) => {
    const input = e.target.value;
    setEmail(input);
  }

  const passwordChangeHandler = (e) => {
    const input = e.target.value;
    setPassword(input);
  }

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      setPassword('');
      console.error('data', data);
    } else {
      cookieCutter.set('token', JSON.stringify(data));
      window.location.href = '/editor';
    }

    console.log(data);
  }

  return <div className={styles.container}>
    <form className={styles.form} onSubmit={submitFormHandler}>
      <p className={styles['form-title']}>4%</p>
      <div className={styles['input-control']}>
        <span className={`${icons['gg-mail']} ${styles.icon}`} />
        <input
          value={email}
          name="email"
          autoFocus
          className={styles.input}
          onChange={emailChangeHandler}
          type="email"
          placeholder="name@domain.com" />
      </div>
      <div className={styles['input-control']}>
        <span className={`${icons['gg-lock']} ${styles.icon}`} style={{ marginLeft: '5px' }} />
        <input
          value={password}
          name="password"
          placeholder="..."
          className={styles.input}
          onChange={passwordChangeHandler}
          type="password" />
      </div>
      <button className={styles['login-button']} type="submit">Login</button>
    </form>
  </div>
}
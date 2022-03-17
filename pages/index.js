import { useState } from 'react';
import Head from '../components/Head';
import styles from '../styles/Home.module.css'
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import Quotes from '../components/Quotes';
import PostsCard from '../components/PostsCard';
import { getPosts } from './api/posts';
import { getOneRandomQuote } from './api/quotes';

export async function getStaticProps() {
  try {
    const posts = await getPosts();
    const quote = await getOneRandomQuote();

    return {
      props: {
        posts,
        quote
      }
    }
  } catch (e) {
    console.error(e);
    return {
      props: {
        posts: []
      }
    }
  }
}

export default function Home({ posts: initialPosts, quote }) {
  const [posts, setPosts] = useState(initialPosts);
  let debounce;

  const fetchDataOnChange = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const text = String(e.target.value).toLowerCase();
      if (text) {
        const filteredPosts = initialPosts.filter(({ title, description }) => {
          return String(title).toLowerCase().includes(text) || String(description).toLowerCase().includes(text);
        });

        setPosts(filteredPosts);
      } else {
        setPosts(initialPosts);
      }
    }, 300);
  }

  return (
    <div className={styles.container}>
      <Head />
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles['web-name']}>R7i </span>
          Software Development Blog
        </h1>
        <Quotes text={quote.text} author={quote.author} />
        <SearchBar onChange={fetchDataOnChange} style={{ margin: '20px 0' }} />

        <div className={styles.grid}>
          {posts.length ? posts.map((item) => {
            return <PostsCard key={item.id} title={item.title} description={item.description} url={item.url || `/posts/${item.id}`} />
          }) : <h1>There is nothing here.</h1>}
        </div>
      </main>
      <Footer />
    </div>
  )
}

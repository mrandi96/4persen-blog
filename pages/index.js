import styles from 'styles/HomePage.module.css'

import { useState, useRef } from 'react';
import Head from 'components/Head';
import SearchBar from 'components/SearchBar';
import Footer from 'components/Footer';
import Quotes from 'components/Quotes';
import PostsCard from 'components/PostsCard';
import { getPosts } from './api/posts';
import { getOneRandomQuote } from './api/quotes';

export async function getStaticProps() {
  try {
    const posts = await getPosts(true);
    const quote = await getOneRandomQuote();

    return {
      props: {
        posts,
        quote
      },
      revalidate: 1,
    }
  } catch (e) {
    console.error(e);
    return {
      props: {
        posts: [],
        quote: {}
      }
    }
  }
}

export default function HomePage({ posts: initialPosts, quote }) {
  const [posts, setPosts] = useState(initialPosts);
  const [showClear, setShowClear] = useState(false);
  const searchRef = useRef();
  let debounce;

  const fetchDataOnChange = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const text = String(e.target.value).toLowerCase();
      if (text) {
        setShowClear(true);
        filterPosts(text);
      } else {
        setShowClear(false);
        setPosts(initialPosts);
      }
    }, 300);
  }

  const filterPosts = (text) => {
    const filteredPosts = initialPosts.filter(({ title, description }) => {
      let query = String(text).toLowerCase();
      return String(title).toLowerCase().includes(query) || String(description).toLowerCase().includes(query);
    });

    setPosts(filteredPosts);
  }

  const clickTagsHandler = (value) => {
    setShowClear(true);
    searchRef.current.value = value;
    filterPosts(value);
  }

  const clearSearch = () => {
    setShowClear(false);
    searchRef.current.value = '';
    filterPosts('');
  }

  return (
    <div className={styles.container}>
      <Head />
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles['web-name']}>4% </span>
          Software Development Blog
        </h1>
        <Quotes text={quote?.text} author={quote?.author} />
        <SearchBar searchRef={searchRef} onChange={fetchDataOnChange} style={{ margin: '20px 0' }} showClear={showClear} clearSearch={clearSearch} />

        <div className={styles.grid}>
          {posts.length ? posts.map((item) => {
            return <PostsCard key={item.id} title={item.title} onClick={clickTagsHandler} description={item.description} url={item.url || `/posts/${item.id}`} />
          }) : <h1>There is nothing here.</h1>}
        </div>
      </main>
      <Footer />
    </div>
  )
}

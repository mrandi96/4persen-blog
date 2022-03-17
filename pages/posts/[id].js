import React, { useEffect, useState } from 'react';
import styles from './Post.module.css';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/router';
import { getPostById } from '../api/posts/[id]';
import { getPosts } from '../api/posts';
import { getMarkdownByName } from '../api/markdowns';
import Head from '../../components/Head';

export async function getStaticProps({ params }) {
  try {
    const data = await getPostById(params.id);
    const content = await getMarkdownByName(data.content || 'notFound');

    return {
      props: {
        data: { ...data, content }
      }
    }
  } catch (e) {
    console.error(e);
    return {
      props: {
        data: {
          title: '404 Not Found'
        }
      }
    }
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const posts = await getPosts();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export default function PostPage({ data }) {
  const router = useRouter();
  const goBackHandler = () => {
    router.back();
  }

  return (
    <div className={styles['main-container']}>
      <Head title={data.title} />
      <h1><span className={styles['back-button']} onClick={goBackHandler}>&larr;</span> {data.title}</h1>
      <h5>{data.createdAt ? `Posted @${data.createdAt}` : ''} {data.readTime ? "| " + data.readTime + ' read' : ''}</h5>
      <Markdown className={styles.content} remarkPlugins={[remarkBreaks, remarkGfm]}>
        {data.content}
      </Markdown>
    </div>
  )
}
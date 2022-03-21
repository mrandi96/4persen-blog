import styles from 'styles/PostsPage.module.css';

import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import Link from 'next/link';
import Head from 'components/Head';
import { getPostById } from '../api/posts/[id]';
import { getPosts } from '../api/posts';
import { getMarkdownByName } from '../api/markdowns';

export async function getStaticProps({ params }) {
  try {
    const data = await getPostById(params.id);
    const content = await getMarkdownByName(data.content || 'notFound');

    return {
      props: {
        data: { ...data, content }
      },
      revalidate: 1,
    }
  } catch (e) {
    if (e.status !== 404) throw e;
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  const posts = await getPosts();

  const paths = posts.map(({ id }) => ({
    params: { id },
  }))

  return { paths,  fallback: 'blocking' }
}

export default function PostPage({ data }) {

  return (
    <div className={styles['main-container']}>
      <Head title={`Blog - ${data.title}`} />
      <Link href="/">
        <h1><span className={styles['back-button']}>&larr;</span> {data.title}</h1>
      </Link>
      <h3 className={styles.date}>{data.createdAt ? `${data.createdAt}` : ''}</h3>
      <Markdown className={styles.content} remarkPlugins={[remarkBreaks, remarkGfm]}>
        {data.content}
      </Markdown>
    </div>
  )
}
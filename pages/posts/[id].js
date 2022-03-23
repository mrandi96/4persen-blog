import styles from 'styles/PostsPage.module.css';
import theme from 'styles/Theme.module.css';

import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Cookies from 'cookies';

import Head from 'components/Head';
import { getPostById } from '../api/posts/[id]';
import { getMarkdownByName } from '../api/markdowns';

export async function getServerSideProps({ req, res, params }) {
  try {
    const data = await getPostById(params.id);
    const content = await getMarkdownByName(data.content || 'notFound');
    const cookies = new Cookies(req, res);
    const isDark = cookies.get('@darkMode') === 'true';

    return {
      props: {
        data: { ...data, content },
        isDark,
      },
    }
  } catch (e) {
    if (e.status !== 404) throw e;
    return {
      notFound: true,
    }
  }
}

export default function PostPage({ data, isDark }) {
  return (
    <div className={`${styles['main-container']} ${theme[isDark ? 'dark' : 'light']}`}>
      <Head title={`Blog - ${data.title}`} />
      <Link href="/">
        <h1 style={{ paddingTop: '0.67em', marginTop: 0 }}><span className={styles['back-button']}>&larr;</span> {data.title}</h1>
      </Link>
      <h3 className={styles.date}>{data.createdAt ? `${data.createdAt}` : ''}</h3>
      <Markdown className={styles.content} remarkPlugins={[remarkBreaks, remarkGfm]}>
        {data.content}
      </Markdown>
    </div>
  )
}

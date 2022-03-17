import Head from 'next/head';

export default function Header ({ title = 'Software Development Blog' }) {
  return <Head>
    <title>{title}</title>
    <meta name="description" content="Tutorials for web development, devops tools, linux and more." />
    <link rel="icon" href="/favicon.ico" />
  </Head>
}
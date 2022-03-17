import Head from 'next/head';

export default function Header ({ title = 'Software Development Blog' }) {
  return <Head>
    <title>{title}</title>
    <meta name="description" content="Development tutorials step by step." />
    <link rel="icon" href="/favicon.ico" />
  </Head>
}
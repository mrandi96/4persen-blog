import styles from './Editor.module.css';
import icons from '../../styles/Icons.module.css';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import Router from 'next/router';
import Cookies from 'cookies';

import Head from '../../components/Head';
import fetcher from '../../utility/fetcher';
import Spinner from '../../components/Spinner';

export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);
  let token = JSON.parse(decodeURIComponent(cookies.get('token')));
  if (!token) return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  }

  return {
    props: {}
  }
}

export default function Editor() {
  const { data, error } = useSWR('/api/posts', fetcher);

  const [documentId, setDocumentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [showList, setShowList] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const inputTitleHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setTitle(input);
  }

  const inputDescriptionHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setDescription(input);
  }

  const markdownTextHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setMarkdownText(input);
  }

  const toggleListHandler = () => {
    setShowList(!showList);
  }

  const clickTitleHandler = async (id) => {
    setIsEdited(false);
    setIsUpdate(true);
    setDocumentId(id);
    const data = await fetcher(`api/posts/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const markdownResponse = await fetch(`api/markdowns?name=${data.content}`);
    const markdown = await markdownResponse.text();

    setTitle(data?.title);
    setDescription(data?.description);
    setMarkdownText(markdown);
  }

  const createNewPostHandler = () => {
    setDocumentId(null);
    setTitle('');
    setDescription('');
    setMarkdownText('');
    setIsUpdate(false);
  }

  const publishPostHandler = async (id) => {
    setShowSpinner(true);
    const response = await fetch(id ? `api/posts/${id}` : 'api/posts', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        markdownText
      })
    });

    // if (response.status === 201) {

    // }

    setIsEdited(false);
    setShowSpinner(false);
    if (!id) Router.reload();
  }

  const createIsDisabled = !(title || description || markdownText && !showSpinner);
  const publishIsDisabled = !(title && description && markdownText && isEdited && !showSpinner);

  return (
    <div className={styles.container}>
      <Head title="4Persen Posts Editor" />
      <div className={`${styles['title-list']} ${showList && styles['collapse-list']}`}>
        <Link href="/"><a className={styles['with-icon']}><span style={{ marginRight: 7 }} className={icons['gg-home-alt']} />Home</a></Link>
        <h2>Published Posts </h2>
        <hr />
        <button disabled={createIsDisabled} onClick={createNewPostHandler} className={`${styles['add-button']} ${styles['with-icon']}`}>
          <span style={{ color: 'white', cursor: 'pointer', marginRight: 7 }} className={icons['gg-add-r']} /> Create New Post
        </button>
        <div className={styles['title-items-list']}>
          {
            error ?
            <p>Failed to load list</p> :
            data?.map(
              (item) => <p key={item.id} onClick={() => clickTitleHandler(item.id)} className={styles['title-list-item']}>{item.title}</p>
            ) || <p>There is nothing here.</p>
          }
        </div>
      </div>
      <div onClick={toggleListHandler} className={styles['list-toggle']}><span className={styles.ellipsis}>&hellip;</span></div>
      <div className={styles.main}>
        <input placeholder="Untitled post" className={`${styles['no-border-input']} ${styles['title-input']}`} name="title" onChange={inputTitleHandler} value={title} />
        <input placeholder="No description" className={`${styles['no-border-input']} ${styles['description-input']}`} name="description" onChange={inputDescriptionHandler} value={description} />
        <textarea className={styles['markdown-editor']} name="markdownText" onChange={markdownTextHandler} value={markdownText} />
        <button
          onClick={() => publishPostHandler(documentId)}
          disabled={publishIsDisabled}
          className={styles['save-button']}>
            <Spinner show={showSpinner} />
            {isUpdate ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

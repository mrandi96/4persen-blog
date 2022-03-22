import styles from 'styles/EditorPage.module.css';
import icons from 'styles/Icons.module.css';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import useSWR from 'swr';
import Cookies from 'cookies';

import Head from 'components/Head';
import Spinner from 'components/Spinner';
import fetcher from 'utility/fetcher';
import { verifyToken } from '../api/verify-token';

export async function getServerSideProps({ req, res }) {
  try {
    const cookies = new Cookies(req, res);
    const encodedUriToken = cookies.get('token');
    const decodedUriToken = decodeURIComponent(encodedUriToken);
    const token = JSON.parse(decodedUriToken);

    const idToken = token?._tokenResponse?.idToken;

    const { cred, failed } = await verifyToken(idToken);

    if (failed) return {
      notFound: true,
    }

    return {
      props: {
        cred
      }
    }
  } catch (e) {
    console.error(e);

    return {
      notFound: true,
    }
  }
}

export default function EditorPage({ cred }) {
  const { data, error } = useSWR('/api/posts', fetcher);

  const [documentId, setDocumentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [showList, setShowList] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [publishToggle, setPublishToggle] = useState(false);
  const [disablePublish, setDisablePublish] = useState(true);
  const [showPublishSpinner, setShowPublishSpinner] = useState(false);

  const inputTitleHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setTitle(input);
    if (window !== undefined) {
      localStorage.setItem('@title', input);
    }
  }

  const inputDescriptionHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setDescription(input);
    if (window !== undefined) {
      localStorage.setItem('@description', input);
    }
  }

  const markdownTextHandler = (e) => {
    const input = e.target.value;
    setIsEdited(true);
    setMarkdownText(input);
    if (window !== undefined) {
      localStorage.setItem('@markdownText', input);
    }
  }

  const toggleListHandler = () => {
    setShowList(!showList);
  }

  const clickTitleHandler = async (data) => {
    setDisablePublish(false);
    setIsEdited(false);
    setIsUpdate(true);
    setDocumentId(data.id);
    const markdownResponse = await fetch(`api/markdowns?name=${data.content}`);
    const markdown = await markdownResponse.text();

    setTitle(data?.title);
    setDescription(data?.description);
    setMarkdownText(markdown);
    setPublishToggle(!!data?.publishedAt);
  }

  const emptyLocalStorage = () => {
    if (window !== undefined) {
      localStorage.setItem('@title', '');
      localStorage.setItem('@description', '');
      localStorage.setItem('@markdownText', '');
    }
  }

  const createNewPostHandler = () => {
    setDisablePublish(true);
    setPublishToggle(false);
    setDocumentId(null);
    setTitle('');
    setDescription('');
    setMarkdownText('');
    setIsUpdate(false);
    emptyLocalStorage();
  }

  const publishPostHandler = async (id, publishedAt) => {
    setDisablePublish(true);
    setShowSpinner(true);
    setShowPublishSpinner(true);

    const response = await fetch(id ? `api/posts/${id}` : 'api/posts', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        markdownText,
        publishedAt
      })
    });

    // if (response.status === 201) {

    // }

    setDisablePublish(false);
    setPublishToggle(publishedAt);
    setIsEdited(false);
    setShowSpinner(false);
    setShowPublishSpinner(false);
    emptyLocalStorage();
    if (!id || publishedAt !== undefined) Router.reload();
  }

  useEffect(() => {
    const title = localStorage.getItem('@title');
    const description = localStorage.getItem('@description');
    const markdownText = localStorage.getItem('@markdownText');

    setTitle(title);
    setDescription(description);
    setMarkdownText(markdownText);
  }, []);

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
              (item) => <div onClick={() => clickTitleHandler(item)} key={item.id} className={`${styles['title-list-item']} ${!item.publishedAt && styles['draft-item']}`}>
                <p>{item.title}</p>
                <span style={{ display: item.publishedAt && 'none' }} className={`${icons['gg-file-document']} ${styles['draft-icon']}`} />
              </div>
            ) || <p>There is nothing here.</p>
          }
        </div>
        <p>Logged in as <span style={{ color: '#0070f3', fontWeight: 'bold' }}>{cred?.email}</span></p>
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
            {isUpdate ? 'Update' : 'Save'}
        </button>
        <button
          disabled={disablePublish}
          onClick={() => publishPostHandler(documentId, !publishToggle)}
          style={{ marginRight: 10 }}
          className={styles['save-button']}>
            <Spinner show={showPublishSpinner} />
            {publishToggle ? 'Unpublish' : 'Publish'}
        </button>

      </div>
    </div>
  )
}

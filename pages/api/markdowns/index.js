import { getStorage, ref, getDownloadURL, uploadString } from 'firebase/storage';
import firebaseApp from 'utility/firebase';

// Create a reference to the file we want to download
const storage = getStorage(firebaseApp);

async function getMarkdownByName(name) {
  const mdRef = ref(storage, `Markdown/${name}.md`);

  // Get the download URL
  // listAll(mdRef)
  return getDownloadURL(mdRef)
    .then(async (url) => {
      // Insert url into an <img> tag to 'download'
      const response = await fetch(url);
      const content =  await response.text();
      return content;
    })
    .catch((error) => {
      console.error(error);
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          return '';
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
}

async function uploadMarkdown(content, markdownText) {
  const storageRef = ref(storage, `Markdown/${content}.md`);

  // Raw string is the default if no format is provided
  const snapshot = await uploadString(storageRef, markdownText)

  return true;
}

export {
  getMarkdownByName,
  uploadMarkdown
}

export default async function handler(req, res) {
  const { name } = req.query;
  const content = await getMarkdownByName(name);

  return res.status(200).send(content);
}

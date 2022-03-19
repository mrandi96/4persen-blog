import firebaseApp from '../../../utility/firebase';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { uploadMarkdown } from '../markdowns';

const db = getFirestore(firebaseApp);

async function getPostById(id) {
  const snapshot = await getDoc(doc(db, 'posts', id));
  if (snapshot.exists()) {
    const data = snapshot.data();
    const createdAt = data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-GB') : null;

    return { ...data, createdAt };
  }

  return null;
}

async function updatePost(id, { markdownText, ...payload }) {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, payload);
  await uploadMarkdown(id, markdownText);
}

export {
  getPostById,
  updatePost
}

export default async function handler(req, res) {
  const { id } = req.query
  let data;
  switch (req.method) {
    case 'GET':
      data = await getPostById(id);

      if (!data) {
        return res.status(404).json({ message: 'posts not found' });
      }

      return res.status(200).json(data);
    case 'PUT':
      const payload = req.body;
      data = await updatePost(id, payload);

      return res.status(200).json({ message: 'post udpated' });
    default:
      return res.status(404).send('404');
  }
}

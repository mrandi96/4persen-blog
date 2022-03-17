import firebaseApp from '../../../utility/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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

export {
  getPostById
}

export default async function handler(req, res) {
  const { id } = req.query
  const data = await getPostById(id);

  if (!data) {
    return res.status(404).json({ message: 'posts not found' });
  }

  return res.status(200).json(data);
}

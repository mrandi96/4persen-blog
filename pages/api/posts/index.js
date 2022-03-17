import firebaseApp from '../../../utility/firebase';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';


const db = getFirestore(firebaseApp);

const getPosts = async () => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', "desc"));
  const snapshot = await getDocs(q);
  const data = [];
  snapshot.forEach((doc) => {
    const currentData = doc.data();
    const createdAt = currentData.createdAt.seconds ? new Date(currentData.createdAt.seconds * 1000).toLocaleDateString('en-GB') : null;
    data.push({ id: doc.id, ...currentData, createdAt });
  });

  return data;
}

export {
  getPosts
}

export default async function handler(req, res) {
  const data = await getPosts();
  
  return res.status(200).json(data);
}
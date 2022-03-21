import { admin } from 'utility/firebase';
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   addDoc,
//   setDoc,
//   Timestamp,
//   doc
// } from 'firebase/firestore';
import { uploadMarkdown } from '../markdowns';


// const db = getFirestore(firebaseApp);
const db = admin.firestore();

const getPosts = async () => {
  const postsRef = db.collection('posts');
  const snapshot = await postsRef.orderBy('createdAt', 'desc').get();

  // const postsRef = collection(db, 'posts');
  // const q = query(postsRef, orderBy('createdAt', "desc"));
  // const snapshot = await getDocs(q);
  const data = [];
  snapshot.forEach((doc) => {
    const currentData = doc.data();
    const createdAt = currentData.createdAt.seconds ? new Date(currentData.createdAt.seconds * 1000).toLocaleDateString('en-GB') : null;
    data.push({ id: doc.id, ...currentData, createdAt });
  });

  return data;
}

async function createPost({ title, description, markdownText }) {
  const ref = db.collection('posts').doc();
  const createdAt = admin.firestore.Timestamp.now();

  // const ref = doc(collection(db, 'posts'));
  // const createdAt = Timestamp.now();
  await setDoc(ref, {
    title,
    description,
    content: ref.id,
    createdAt,
  });

  await uploadMarkdown(ref.id, markdownText);

  return {
    id: ref.id,
    title,
    description,
    content: ref.id,
    createdAt,
  };
}

export {
  getPosts,
  createPost
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const data = await getPosts();
      
      return res.status(200).json(data);
    case 'POST':
      const payload = req.body;
      const id = await createPost(payload);

      return res.status(201).json({ message: `Document with id ${id} created.`})
    default:
      return res.status(404).send('404');
  }

}
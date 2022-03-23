import { admin } from 'utility/firebase';
import { uploadMarkdown } from '../markdowns';

const db = admin.firestore();

const getPosts = async (isPublished = false) => {
  const postsRef = db.collection('posts');
  let query = postsRef;
  if (isPublished) {
    query = query.orderBy('publishedAt', 'desc').where('publishedAt', '!=', null);
  }
  query = query.orderBy('createdAt', 'desc');
  const snapshot = await query.get();

  const data = [];
  snapshot.forEach((doc) => {
    const currentData = doc.data();
    const createdAt = currentData.createdAt?.seconds ? new Date(currentData.createdAt.seconds * 1000).toLocaleDateString('en-GB') : null;
    const publishedAt = currentData.publishedAt?.seconds ? new Date(currentData.publishedAt.seconds * 1000).toLocaleDateString('en-GB') : null;
    data.push({ id: doc.id, ...currentData, createdAt, publishedAt });
  });

  return data;
}

async function createPost({ title, description, markdownText }) {
  const newPostRef = db.collection('posts').doc();
  const createdAt = admin.firestore.Timestamp.now();
  const publishedAt = null;

  const { id } = newPostRef;

  await newPostRef.set({
    title,
    description,
    content: id,
    createdAt,
    publishedAt
  });

  await uploadMarkdown(id, markdownText);

  return {
    id,
    title,
    description,
    content: id,
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
      const { isPublished = false } = req.query;
      const data = await getPosts(!!isPublished);
      
      return res.status(200).json(data);
    case 'POST':
      try {
        const payload = req.body;
        const data = await createPost(payload);

        return res.status(201).json(data);
      } catch (e) {
        console.error(e);

        return res.status(500).json({ message: 'Internal Server Error' });
      }
    default:
      return res.status(404).send('404');
  }

}
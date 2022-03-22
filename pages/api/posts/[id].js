import moment from 'moment';
import { admin } from 'utility/firebase';
import { uploadMarkdown } from '../markdowns';

const db = admin.firestore();

async function getPostById(id) {
  const snapshot = await db.collection('posts').doc(id).get();
  if (snapshot.exists) {
    const data = snapshot.data();
    const createdAt = data.createdAt?.seconds ? moment(new Date(data.createdAt.seconds * 1000)).format('DD MMMM YYYY') : null;
    const publishedAt = data.publishedAt?.seconds ? moment(new Date(data.publishedAt.seconds * 1000)).format('DD MMMM YYYY') : null;

    return { ...data, createdAt, publishedAt };
  }

  const e = new Error('data not found');
  e.status = 404;
  throw e;
}

async function updatePost(id, { markdownText, publishedAt, ...payload }) {
  const postRef = db.collection('posts').doc(id)
  const res = await postRef.update({
    ...payload,
    publishedAt: publishedAt ? admin.firestore.Timestamp.now() : null
  });
  await uploadMarkdown(id, markdownText);

  return res;
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

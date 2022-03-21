import { admin } from 'utility/firebase';

const auth = admin.auth();

const verifyToken = async (idToken) => {
  try {
    const cred = await auth.verifyIdToken(idToken);
    
    return { cred, failed: false };
  } catch (e) {
    console.error(e);
    return { cred: '', failed: true };
  }
}

export {
  verifyToken
}

export default async function handler(req, res) {
  try {
    const { idToken } = req.query;
    const cred = await verifyToken(idToken);
    
    return res.status(200).json({ cred });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}
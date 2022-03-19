import firebaseApp from '../../utility/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;
    const auth = getAuth(firebaseApp);
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    return res.status(200).json(userCredential);
  } catch (e) {
    let statusCode;
    console.log(e.code);
    switch (e.code) {
      case 'auth/wrong-password':
        statusCode = 401;
        break;
      case 'auth/too-many-requests':
        statusCode = 429;
        res.writeHead(429, { Location: '/' });
      default:
        statusCode = 500;
        break;
    }

    // return res.status(errorCode || 500).json({ message: errorMessage })
    return res.status(statusCode).json({ message: e.message || 'Internal server error' })
  }
}
import { initializeApp } from 'firebase/app';
import admin from 'firebase-admin';

const stringAccountService = process.env.FS_ACCOUNT_SERVICE;
const serviceAccount = JSON.parse(stringAccountService);
const firebaseConfig = {
  apiKey: 'AIzaSyDv2N6jMpgd3v4o7YZuW7qRWxabKi6n7yU',
  authDomain: 'github-pages-ac16a.firebaseapp.com',
  projectId: 'github-pages-ac16a',
  storageBucket: 'github-pages-ac16a.appspot.com',
  messagingSenderId: '784440320686',
  appId: '1:784440320686:web:9afcdd79c80d148548433f'
};

const app = initializeApp(firebaseConfig);

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (e) {
  if (!/already exists/u.test(e.message)) {
    console.error('firebase initialization error', e);
  }
}

export {
  admin,
  app
}

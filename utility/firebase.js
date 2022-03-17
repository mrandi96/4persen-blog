import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const serviceAccount = {
//   type: process.env.FS_TYPE,
//   project_id: '',
//   private_key_id: '',
//   private_key: '',
//   client_email: '',
//   client_id: '',
//   auth_uri: '',
//   token_uri: '',
//   auth_provider_x509_cert_url: '',
//   client_x509_cert_url: ''
// }
const firebaseConfig = {
  apiKey: 'AIzaSyDv2N6jMpgd3v4o7YZuW7qRWxabKi6n7yU',
  authDomain: 'github-pages-ac16a.firebaseapp.com',
  projectId: 'github-pages-ac16a',
  storageBucket: 'github-pages-ac16a.appspot.com',
  messagingSenderId: '784440320686',
  appId: '1:784440320686:web:9afcdd79c80d148548433f'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// try {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
// } catch (e) {
//   if (!/already exists/u.test(e.message)) {
//     console.error('firebase initialization error', e);
//   }
// }

// export {
//   admin
// }

export default app;
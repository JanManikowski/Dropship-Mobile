import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAl8D0K3ZZ3kJMS-OSQd1pT6At5AV-6OUc',
  authDomain: 'dropship-45d6d.firebaseapp.com',
  projectId: 'dropship-45d6d',
  storageBucket: 'dropship-45d6d.firebasestorage.app',
  messagingSenderId: '707535818764',
  appId: '1:707535818764:web:41c4fe6c9b0c77370a1e29',
  measurementId: 'G-GKJ7W3D9XC'
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);  

export { db, auth, storage };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDP-Iz8PEinfP1bbu5Cnl_d56uvr8jxWRc',
  authDomain: 'wordle-c6031.firebaseapp.com',
  projectId: 'wordle-c6031',
  storageBucket: 'wordle-c6031.appspot.com',
  messagingSenderId: '191974523581',
  appId: '1:191974523581:web:3b3a736d33d1ba17932dd4',
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQeeNZsjnKrHN9U38kbXtd96-Tn_7vtkE",
  authDomain: "thea-candle.firebaseapp.com",
  projectId: "thea-candle",
  storageBucket: "thea-candle.firebasestorage.app",
  messagingSenderId: "700194902330",
  appId: "1:700194902330:web:c8b26fef0b487d5e6ac003",
  measurementId: "G-MDHT17L51B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
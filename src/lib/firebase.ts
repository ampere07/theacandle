import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQeeNZsjnKrHN9U38kbXtd96-Tn_7vtkE",
  authDomain: "thea-candle.firebaseapp.com",
  projectId: "thea-candle",
  storageBucket: "thea-candle.firebasestorage.app",
  messagingSenderId: "700194902330",
  appId: "1:700194902330:web:c8b26fef0b487d5e6ac003",
  measurementId: "G-MDHT17L51B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Initialize Firestore with custom settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
enableIndexedDbPersistence(db, {
  forceOwnership: true
}).catch((error) => {
  if (error.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (error.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChRGi5cwM4GdmUErOrK7XB8GRw4y8pmYo",
  authDomain: "socialapp-798ba.firebaseapp.com",
  projectId: "socialapp-798ba",
  storageBucket: "socialapp-798ba.firebasestorage.app",
  messagingSenderId: "330967687445",
  appId: "1:330967687445:web:da4769d59e0876af79891c"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);

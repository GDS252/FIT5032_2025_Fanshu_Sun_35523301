// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUjvMKg8n0NCTSFPPO2zc7mC4mHx3uJIM",
  authDomain: "week7-fanshu-sun.firebaseapp.com",
  projectId: "week7-fanshu-sun",
  storageBucket: "week7-fanshu-sun.firebasestorage.app",
  messagingSenderId: "843539143238",
  appId: "1:843539143238:web:d1b7a475f96f1114a90847"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Firebase Auth
import { initFirebaseAuth } from '../firebaseAuth.js'
initFirebaseAuth()

export default db;
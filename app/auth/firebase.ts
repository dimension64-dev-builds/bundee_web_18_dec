import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZyUq9n3lPrLmcmOSOzWY5_hYud-nQUew",
  authDomain: "bundee.firebaseapp.com",
  projectId: "bundee",
  storageBucket: "bundee.appspot.com",
  messagingSenderId: "238975725958",
  appId: "1:238975725958:web:e41401ba2ad7548ecefc07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBMsLYGTo045waetwQ0hg04p9o5OoXCV4c",
  authDomain: "bype-app.firebaseapp.com",
  projectId: "bype-app",
  storageBucket: "bype-app.appspot.com",
  messagingSenderId: "471394920900",
  appId: "1:471394920900:web:fa53b38ca8d11f50a51c91",
  measurementId: "G-J4HPNMGL6R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

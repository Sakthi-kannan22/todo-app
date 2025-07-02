import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5XS7i7xG6js_H97L-F2LSqL_O1kfCzC4",
  authDomain: "todo-app-f2c73.firebaseapp.com",
  projectId: "todo-app-f2c73",
  storageBucket: "todo-app-f2c73.firebasestorage.app",
  messagingSenderId: "58407559650",
  appId: "1:58407559650:web:ac99855f4fd400a83ad9bb",
  measurementId: "G-KQZYCH5BW4"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

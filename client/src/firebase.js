import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAF7cGZQ9RvtYHwjfemRhMr9DjYo7tJlUs",
    authDomain: "video-e00fc.firebaseapp.com",
    projectId: "video-e00fc",
    storageBucket: "video-e00fc.appspot.com",
    messagingSenderId: "879411916720",
    appId: "1:879411916720:web:e46339efa669ffea307075"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider()

export default app
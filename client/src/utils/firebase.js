import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDukqa6HcAYsXi47-f_ihKqFykEK8wlqQY",
  authDomain: "project-1-90950.firebaseapp.com",
  projectId: "project-1-90950",
  storageBucket: "project-1-90950.appspot.com",
  messagingSenderId: "110033516216",
  appId: "1:110033516216:web:47df86d70836e465b1264d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
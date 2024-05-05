
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
/* import { getFirestore } from 'firebase/firestore'; */
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCmVJCsZzj4QQS6kc81MWv2b8lO_7QDnJY",
  authDomain: "taskdata-eeb70.firebaseapp.com",
  databaseURL: "https://taskdata-eeb70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "taskdata-eeb70",
  storageBucket: "taskdata-eeb70.appspot.com",
  messagingSenderId: "168497138378",
  appId: "1:168497138378:web:962eaf1f42b9206ebf0233",
  measurementId: "G-M3VEPZFBFW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth }; 
export default app; 
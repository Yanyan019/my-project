
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmVJCsZzj4QQS6kc81MWv2b8lO_7QDnJY",
  authDomain: "taskdata-eeb70.firebaseapp.com",
  projectId: "taskdata-eeb70",
  storageBucket: "taskdata-eeb70.appspot.com",
  messagingSenderId: "168497138378",
  appId: "1:168497138378:web:962eaf1f42b9206ebf0233",
  measurementId: "G-M3VEPZFBFW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
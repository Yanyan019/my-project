
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCk4hzdbd9CoC854pPDexP0ngutSM8wIdM",
  authDomain: "mikezxcs-55fb3.firebaseapp.com",
  projectId: "mikezxcs-55fb3",
  storageBucket: "mikezxcs-55fb3.appspot.com",
  messagingSenderId: "863982717964",
  appId: "1:863982717964:web:ab93b29ef263591a267229",
  measurementId: "G-Z2GGEQMT0W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
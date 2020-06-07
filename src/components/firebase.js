import firebase from 'firebase/app';
// Import services that are actually required
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { API_KEY } from '../../firebase_api'

// Ok, to have this in the frontend (not a vulnerability)
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "voxer-clone.firebaseapp.com",
  databaseURL: "https://voxer-clone.firebaseio.com",
  projectId: "voxer-clone",
  storageBucket: "voxer-clone.appspot.com",
  messagingSenderId: "117431946308",
  appId: "1:117431946308:web:7e5c33f574c2367c0ac011",
  measurementId: "G-EX1GLGK544"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

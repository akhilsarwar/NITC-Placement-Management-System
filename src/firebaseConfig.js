// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUiyS1UKX-HyIn59zNoMkEykCGCBOOQWo",
  authDomain: "nitc-pms.firebaseapp.com",
  projectId: "nitc-pms",
  storageBucket: "nitc-pms.appspot.com",
  messagingSenderId: "271055681754",
  appId: "1:271055681754:web:18c81e528fb1b9429d4de3",
  measurementId: "G-MMVTYKH72S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const db = getFirestore()
export default firebase;
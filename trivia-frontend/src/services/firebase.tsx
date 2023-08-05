// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut, } from "firebase/auth";

   import {
        getFirestore,
        query,
        getDocs,
        collection,
        where,
        addDoc,
    } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByXpOsMu6_Tx-NX8wfLP0O9jVnJOK0YDM",
  authDomain: "serverless-a2-bde44.firebaseapp.com",
  projectId: "serverless-a2-bde44",
  storageBucket: "serverless-a2-bde44.appspot.com",
  messagingSenderId: "393193783856",
  appId: "1:393193783856:web:32ae07a930423dcb0fe3f5",
  measurementId: "G-L3H5YJHHWV"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
 const auth = getAuth(app);
 export default auth;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc-C2gSmnOtIn0tJhwNB0F9tEo6TtKXSc",
  authDomain: "serverless-project-nl-api.firebaseapp.com",
  projectId: "serverless-project-nl-api",
  storageBucket: "serverless-project-nl-api.appspot.com",
  messagingSenderId: "764546055933",
  appId: "1:764546055933:web:96fa2b481fbbabaa4b4894",
  measurementId: "G-CNTJQV2XYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
const analytics = getAnalytics(app);
export const db = getFirestore(app);

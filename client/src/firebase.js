import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJjAzFkccyx1vD0HmUOFSCwq5wA8sUw58",
  authDomain: "airbnb-e9cb6.firebaseapp.com",
  projectId: "airbnb-e9cb6",
  storageBucket: "airbnb-e9cb6.appspot.com",
  messagingSenderId: "848445239520",
  appId: "1:848445239520:web:75baa124101555dfc0e085",
  measurementId: "G-34JV22HYF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
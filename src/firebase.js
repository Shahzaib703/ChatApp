// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBNQ49zFJVSWo__J4rP0xGxkVrlIk25DxA",
    authDomain: "massagingapp-4fa3c.firebaseapp.com",
    databaseURL: "https://massagingapp-4fa3c-default-rtdb.firebaseio.com",
    projectId: "massagingapp-4fa3c",
    storageBucket: "massagingapp-4fa3c.appspot.com",
    messagingSenderId: "747314343439",
    appId: "1:747314343439:web:b8ceec60f13d518e493d7a",
    measurementId: "G-HS5Z4PNLYX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
// Firebase configuration

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    // public info
    apiKey: "AIzaSyAtSpKz6vdsdCWQCV-0bTsNGL5KTklKi3s",
    authDomain: "balderdash-2cc9d.firebaseapp.com",
    projectId: "balderdash-2cc9d",
    storageBucket: "balderdash-2cc9d.appspot.com",
    messagingSenderId: "572175898334",
    appId: "1:572175898334:web:be6140f61c4ef6b74c544f",
    measurementId: "G-VW8BENMW4Q",
    databaseURL: "https://balderdash-2cc9d-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { app, db };

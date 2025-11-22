// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBG1xwk7n863tpk7FYUBhOTEs-4HO1ht64",
    authDomain: "mocomoco-39b6c.firebaseapp.com",
    projectId: "mocomoco-39b6c",
    storageBucket: "mocomoco-39b6c.appspot.com",
    messagingSenderId: "546259757508",
    appId: "1:546259757508:web:fd26534abafb1609475c91",
    measurementId: "G-EWGLDYYSF4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

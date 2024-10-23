import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, where, getDocs, onSnapshot, orderBy, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZAN04pm_jAKelb4ZFfFuwQULYoitmv4k",
    authDomain: "chat-app-2b2e5.firebaseapp.com",
    projectId: "chat-app-2b2e5",
    storageBucket: "chat-app-2b2e5.appspot.com",
    messagingSenderId: "853428198525",
    appId: "1:853428198525:web:eb8c7a9c2a314903142514",
    measurementId: "G-2EKBYYKC5J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    db,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    onAuthStateChanged,
    getDoc,
    signOut,
    signInWithEmailAndPassword,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    orderBy,
    serverTimestamp,
    updateDoc,
    arrayUnion
}
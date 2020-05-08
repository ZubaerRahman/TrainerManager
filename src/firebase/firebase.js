import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDF3cNaNEGdzhrZkhuvaOdiPFOMgflAc0w",
    authDomain: "segroup23.firebaseapp.com",
    databaseURL: "https://segroup23.firebaseio.com",
    projectId: "segroup23",
    storageBucket: "segroup23.appspot.com",
    messagingSenderId: "675915657727",
    appId: "1:675915657727:web:fcf9d1199acddcad62b7ca"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;
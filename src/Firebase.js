import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase_config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const register = (email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Registration failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}

export const login = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Login failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}

export const logout = (email, password) => {
  firebase.auth().signOut().catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Logout failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}
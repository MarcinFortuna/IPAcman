import * as firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "./firebase_config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const signUp = (email, password) => {
  console.log("in the signUp function");
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Signup failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}

export const signIn = (email, password) => {
  console.log("in the signIn function");
  firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Signin failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}

export const signOut = () => {
  console.log("in the signOut function");
  firebase.auth().signOut().catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Signout failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
}
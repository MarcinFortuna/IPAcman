import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from "./firebase_config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const databaseUsers = firebase.database().ref('Users/');

export const signUp = async (email, password, name, affiliation) => {
  console.log("in the signUp function");
  let newUser = await firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("Signup failed!");
    console.log(errorCode);
    console.log(errorMessage);
    alert("Signup failed! " + errorMessage);
  });
  if (newUser.user.email === email) {
    let uid = newUser.user.uid;
    let newDbEntry = databaseUsers.push();
    (await newDbEntry).set({
      "uid": uid,
      "email": email,
      "affiliation": affiliation,
      "name": name
    });
  }
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
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from "./firebase_config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export const databaseUsers = firebase.database().ref('Users/');
export const databaseLeaderboard = firebase.database().ref('Leaderboard/');

export const signUp = (email: string, password: string, name: string = "", displayName: string, affiliation: string = "") => {
  console.log("in the signUp function");
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(async (newUser: firebase.auth.UserCredential) => {
    console.log("Signup successful");
    let uid: string | undefined = newUser?.user?.uid;
    let newDbEntry: firebase.database.ThenableReference = databaseUsers.push();
    (await newDbEntry).set({
      "uid": uid,
      "email": email,
      "affiliation": affiliation,
      "name": name,
      "displayName": displayName,
      "attempts": [""]
    });
  })
  .catch(error => {
    let errorCode: boolean | null | undefined = error.code;
    let errorMessage = error.message;
    console.log("Signup failed!");
    console.log(errorCode);
    console.log(errorMessage);
    alert("Signup failed! " + errorMessage);
  });
  sessionStorage.removeItem("results");
  sessionStorage.removeItem("attempts");
}

export const signIn = (email: string, password: string) => {
  console.log("in the signIn function");
  firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
    let errorCode: boolean | null | undefined = error.code;
    let errorMessage = error.message;
    console.log("Signin failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
  sessionStorage.removeItem("results");
  sessionStorage.removeItem("attempts");
}

export const signOut = () => {
  console.log("in the signOut function");
  firebase.auth().signOut().catch(error => {
    let errorCode: boolean | null | undefined = error.code;
    let errorMessage = error.message;
    console.log("Signout failed!");
    console.log(errorCode);
    console.log(errorMessage);
  });
  sessionStorage.removeItem("results");
  sessionStorage.removeItem("attempts");
}
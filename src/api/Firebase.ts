import * as firebase from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from "firebase/auth";
import {getDatabase, ref, ThenableReference, push, set} from "firebase/database"
import "firebase/database";
import {firebaseConfig} from "./firebase_config";

const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth();

export const database = getDatabase(app);
export const databaseUsers = ref(database, 'Users/');
export const databaseLeaderboard = ref(database, 'Leaderboard/');

export const signUp = (email: string, password: string, name: string = "", displayName: string, affiliation: string = "") => {
    console.log("in the signUp function");
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (newUser: UserCredential) => {
            console.log(`Signup for ${email} successful`);
            let uid: string | undefined = newUser?.user?.uid;
            let newDbEntry: ThenableReference = push(databaseUsers);
            set(newDbEntry, {
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
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {console.log(`Sign in for ${email} was successful`)})
        .catch(error => {
        let errorCode: boolean | null | undefined = error.code;
        let errorMessage = error.message;
        console.log("Signin failed!");
        console.log(errorCode);
        console.log(errorMessage);
    });
    sessionStorage.removeItem("results");
    sessionStorage.removeItem("attempts");
}

export const signOutOfApp = () => {
    console.log("in the signOut function");
    signOut(auth)
        .then(() => {console.log("Sign out successful")})
        .catch(error => {
        let errorCode: boolean | null | undefined = error.code;
        let errorMessage = error.message;
        console.log("Signout failed!");
        console.log(errorCode);
        console.log(errorMessage);
    });
    sessionStorage.removeItem("results");
    sessionStorage.removeItem("attempts");
}
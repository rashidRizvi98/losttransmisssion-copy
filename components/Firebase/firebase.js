import { LogBox } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

import firebaseConfig from "./firebaseConfig";

// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

export const auth = firebase.auth();

export const db = firebase.firestore();

export const loginWithEmail = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const registerWithEmail = async (email, password) => {
  await auth.createUserWithEmailAndPassword(email, password);

  const currentUser = auth.currentUser;

  db.collection("users").doc(currentUser.uid).set({
    email: currentUser.email,
  });
};
export const logout = () => auth.signOut();

export const passwordReset = (email) => auth.sendPasswordResetEmail(email);

// avoid deprecated warnings
// db.settings({
//   timestampsInSnapshots: true,
// });

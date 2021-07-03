import firebase from "./init";
import "firebase/firestore";

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { db, timestamp };

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCFOVQ53rJd11YPB9MGVse29jNvVGKkeNw",
  authDomain: "resounding-axe-466.firebaseapp.com",
  databaseURL: "https://resounding-axe-466.firebaseio.com",
  projectId: "resounding-axe-466",
  storageBucket: "resounding-axe-466.appspot.com",
  messagingSenderId: "297394980848"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export {
  auth,
  db
};

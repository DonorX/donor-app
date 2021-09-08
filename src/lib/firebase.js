import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// const firebaseConfig = {
//   apiKey: `${process.env.REACT_APP_API_KEY}`,
//   authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
//   projectId: `${process.env.REACT_APP_PROJECT_ID}`,
//   storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
//   messagingSenderId: `${process.env.REACT_APP_SENDER_ID}`,
//   appId: `${process.env.REACT_APP_APP_ID}`,
// };

const firebaseConfig = {
  apiKey: "AIzaSyC4B2ziUwWD4wXNjr6NKGA7YHUyzhwjgIk",
  authDomain: "donorx-c9bfc.firebaseapp.com",
  projectId: "donorx-c9bfc",
  storageBucket: "donorx-c9bfc.appspot.com",
  messagingSenderId: "1087930872477",
  appId: "1:1087930872477:web:afe5ead410dc16efdf9a74"
};

const fb = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { fb, db, auth };

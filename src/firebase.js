  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAgc5MRsoKGTdTJPl6FN-62arzcf2owI7Y",
    authDomain: "instagram-clone-react-f48af.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-f48af.firebaseio.com",
    projectId: "instagram-clone-react-f48af",
    storageBucket: "instagram-clone-react-f48af.appspot.com",
    messagingSenderId: "53795432449",
    appId: "1:53795432449:web:db116dcd2a7affd5733800",
    measurementId: "G-2SPJ076ZTH"
  });

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();
  const storage = firebaseApp.storage();

  export {db, auth, storage};
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_ZH7zqa3cjJ0pp5poTGkBNcC7XrhiwtI",
  authDomain: "list-app-96e53.firebaseapp.com",
  projectId: "list-app-96e53",
  storageBucket: "list-app-96e53.appspot.com",
  messagingSenderId: "466624437702",
  appId: "1:466624437702:web:9111769bd53f0f7687e6c7",
  measurementId: "G-QSSG9QNCEL",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };

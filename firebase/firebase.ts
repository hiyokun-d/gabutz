import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
	apiKey: "AIzaSyA1pC9LpPe1eEdUlzjId6r7MX5J7POhIts",
	authDomain: "gabutz-chat-2f280.firebaseapp.com",
	projectId: "gabutz-chat-2f280",
	storageBucket: "gabutz-chat-2f280.appspot.com",
	messagingSenderId: "1020533209120",
	appId: "1:1020533209120:web:742e77da466f8d92866445",
	measurementId: "G-YDM7JF4XDY",
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app)
 const auth = getAuth(app)
 export {db, auth}

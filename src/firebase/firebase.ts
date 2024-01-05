import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
;

const firebaseConfig = {
	apiKey: process.env.API,
	authDomain: "gabutz-chat.firebaseapp.com",
	projectId: "gabutz-chat",
	storageBucket: "gabutz-chat.appspot.com",
	messagingSenderId: "454570055409",
	appId: "1:454570055409:web:d7c711b66a715d0dda7b50",
	measurementId: "G-PKETF936KJ",
};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
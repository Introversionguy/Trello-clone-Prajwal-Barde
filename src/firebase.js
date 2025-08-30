// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC35D7c5np8IBSozkOTvpacLNBihDouq1Y",
  authDomain: "realtime-task-board-65a60.firebaseapp.com",
  projectId: "realtime-task-board-65a60",
  storageBucket: "realtime-task-board-65a60.firebasestorage.app",
  messagingSenderId: "647611557076",
  appId: "1:647611557076:web:ca99e130298a145a158741",
  measurementId: "G-0RSKT7NRBL"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your React app
export const db = getDatabase(app);
export const auth = getAuth(app);

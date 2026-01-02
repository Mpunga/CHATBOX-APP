// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiDFzvqJKu91AlPdsOH82fJtfnxYrwcXY",
  authDomain: "chatbox-59b2c.firebaseapp.com",
  databaseURL: "https://chatbox-59b2c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatbox-59b2c",
  storageBucket: "chatbox-59b2c.firebasestorage.app",
  messagingSenderId: "1063502553090",
  appId: "1:1063502553090:web:c5290d1cd41113b76b071b",
  measurementId: "G-TJM4XZVZ7D"
};

/* // Initialize Firebases
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 */

const base = initializeApp(firebaseConfig)

// Base de données
export const database = getDatabase(base)

export const auth = getAuth(base)


export default base
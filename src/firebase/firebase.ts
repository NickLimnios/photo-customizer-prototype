import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd-Giyt8xzO6decqIrvcNa8_MFRoyf7R8",
  authDomain: "photobook-37abd.firebaseapp.com",
  projectId: "photobook-37abd",
  storageBucket: "photobook-37abd.firebasestorage.app",
  messagingSenderId: "658034228925",
  appId: "1:658034228925:web:aa4e7a82d307f76bf101d4",
  measurementId: "G-BXYPJKR552",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

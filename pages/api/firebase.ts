import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
    
}



const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const auth = getAuth(app);

const db = initializeFirestore(app, { experimentalForceLongPolling: true });

export { auth, db , storage};

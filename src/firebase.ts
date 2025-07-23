import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCW7yjdD-FqTyJ_GTXI8WNmv9QRfEC9LWI",
  authDomain: "we-queue-50eea.firebaseapp.com",
  databaseURL: "https://we-queue-50eea-default-rtdb.firebaseio.com",
  projectId: "we-queue-50eea",
  storageBucket: "we-queue-50eea.appspot.com",
  messagingSenderId: "733658791356",
  appId: "1:733658791356:web:d70887795a9dfe0ab4ffb9",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 
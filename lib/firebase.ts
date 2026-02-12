import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  
  // Enable persistence across page refreshes
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('Firebase persistence setup warning:', error.message);
  });
} catch (error) {
  console.warn('Firebase initialization failed. Running in demo mode.', error);
  // Firebase will be used in demo mode with mock auth
}

export { auth };
export default app;

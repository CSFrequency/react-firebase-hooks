import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export const app = initializeApp({ projectId: 'demo-noop' });

export const db = getFirestore(app);

connectFirestoreEmulator(db, 'localhost', 8080);

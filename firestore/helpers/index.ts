import { firestore, FirebaseError } from 'firebase';

export const snapshotToData = (
  snapshot: firestore.DocumentSnapshot,
  idField?: string
) => {
  if (!snapshot.exists) return null;
  return {
    ...snapshot.data(),
    ...(idField ? { [idField]: snapshot.id } : null),
  };
};

export const transformError = (error: Error): FirebaseError => {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: '',
  };
};

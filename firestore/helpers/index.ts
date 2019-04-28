import { firestore } from 'firebase';

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

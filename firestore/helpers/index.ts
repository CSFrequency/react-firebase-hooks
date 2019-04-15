import { firestore } from 'firebase';

export const snapshotToData = (
  snapshot: firestore.DocumentSnapshot,
  idField?: string
) => ({
  ...snapshot.data(),
  ...(idField ? { [idField]: snapshot.id } : null),
});

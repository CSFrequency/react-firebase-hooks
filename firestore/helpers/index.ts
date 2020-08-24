import { firestore } from 'firebase';

export const snapshotToData = (
  snapshot: firestore.DocumentSnapshot,
  idField?: string,
  refField?: string,
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  return {
    ...snapshot.data(),
    ...(idField ? { [idField]: snapshot.id } : null),
    ...(refField ? { [refField]: snapshot.ref } : null),
  };
};

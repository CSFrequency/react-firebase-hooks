import firebase from 'firebase/app';

export const snapshotToData = (
  snapshot: firebase.firestore.DocumentSnapshot,
  idField?: string,
  refField?: string
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

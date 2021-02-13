import firebase from 'firebase/app';

export const snapshotToData = <T>(
  snapshot: firebase.firestore.DocumentSnapshot,
  snapshotOptions?: firebase.firestore.SnapshotOptions,
  idField?: string,
  refField?: string,
  transform?: (val: any) => T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  return {
    ...(transform
      ? transform(snapshot.data(snapshotOptions))
      : snapshot.data(snapshotOptions)),
    ...(idField ? { [idField]: snapshot.id } : null),
    ...(refField ? { [refField]: snapshot.ref } : null),
  };
};

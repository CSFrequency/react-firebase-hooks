import firebase from 'firebase/app';

export const snapshotToData = <T = firebase.firestore.DocumentData>(
  snapshot: firebase.firestore.DocumentSnapshot,
  snapshotOptions?: firebase.firestore.SnapshotOptions,
  idField?: string,
  refField?: string,
  transform?: (val: any) => T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  let data = snapshot.data(snapshotOptions) as firebase.firestore.DocumentData;
  if (transform) {
    data = transform(data);
  }
  if (idField) {
    data[idField] = snapshot.id;
  }
  if (refField) {
    data[refField] = snapshot.ref;
  }

  return data;
};

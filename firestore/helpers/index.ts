import firebase from 'firebase/app';

export type Options = {
  snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
};
export type DataOptions = Options & {
  idField?: string;
  refField?: string;
};

export const snapshotToData = (
  snapshot: firebase.firestore.DocumentSnapshot,
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

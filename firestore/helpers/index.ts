import {
  DocumentData,
  DocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

export const snapshotToData = <T = DocumentData>(
  snapshot: DocumentSnapshot,
  snapshotOptions?: SnapshotOptions,
  idField?: string,
  refField?: string,
  transform?: (val: any) => T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  let data = snapshot.data(snapshotOptions) as DocumentData;
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

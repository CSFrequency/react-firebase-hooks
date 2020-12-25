import firebase from 'firebase/app';

export type ValOptions = {
  keyField?: string;
  refField?: string;
};

const isObject = (val: any) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const snapshotToData = (
  snapshot: firebase.database.DataSnapshot,
  keyField?: string,
  refField?: string
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  const val = snapshot.val();
  if (isObject(val)) {
    return {
      ...val,
      ...(keyField ? { [keyField]: snapshot.key } : null),
      ...(refField ? { [refField]: snapshot.ref } : null),
    };
  }
  return val;
};

import firebase from 'firebase/app';

export type ValOptions<T> = {
  keyField?: string;
  refField?: string;
  transform?: (val: any) => T;
};

const isObject = (val: any) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const snapshotToData = <T>(
  snapshot: firebase.database.DataSnapshot,
  keyField?: string,
  refField?: string,
  transform?: (val: any) => T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  const val = snapshot.val();
  if (isObject(val)) {
    return {
      ...(transform ? transform(val) : val),
      ...(keyField ? { [keyField]: snapshot.key } : null),
      ...(refField ? { [refField]: snapshot.ref } : null),
    };
  }
  return transform ? transform(val) : val;
};

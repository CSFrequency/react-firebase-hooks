import firebase from 'firebase/app';

const isObject = (val: any) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const snapshotToData = <T>(
  snapshot: firebase.database.DataSnapshot,
  keyField?: string,
  refField?: string,
  transform: (any) => T = (value) => value as T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  const val = snapshot.val();
  if (isObject(val)) {
    return {
      ...transform(val),
      ...(keyField ? { [keyField]: snapshot.key } : null),
      ...(refField ? { [refField]: snapshot.ref } : null),
    };
  }
  return val;
};

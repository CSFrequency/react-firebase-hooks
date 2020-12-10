import firebase from 'firebase/app';

const isObject = (val: any) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const snapshotToData = (
  snapshot: firebase.database.DataSnapshot,
  keyField?: string
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  const val = snapshot.val();
  if (isObject(val)) {
    return {
      ...val,
      ...(keyField ? { [keyField]: snapshot.key } : null),
    };
  }
  return val;
};

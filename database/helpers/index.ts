import { database } from 'firebase';

const isObject = (val: any) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const snapshotToData = (
  snapshot: database.DataSnapshot,
  keyField?: string
) => {
  const val = snapshot.val();
  if (isObject(val)) {
    return {
      ...val,
      ...(keyField ? { [keyField]: snapshot.key } : null),
    };
  }
  return val;
};

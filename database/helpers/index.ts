import { database } from 'firebase';
import * as isObject from 'isobject';

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

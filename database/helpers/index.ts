import { database } from 'firebase';

export const snapshotToData = (
  snapshot: database.DataSnapshot,
  keyField?: string
) => ({
  ...snapshot.val(),
  ...(keyField ? { [keyField]: snapshot.key } : null),
});

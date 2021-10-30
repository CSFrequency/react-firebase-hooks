import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  queryEqual,
  refEqual,
  SnapshotOptions,
} from 'firebase/firestore';
import { RefHook, useComparatorRef } from '../../util';

export const snapshotToData = <T = DocumentData>(
  snapshot: DocumentSnapshot<T>,
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

const isRefEqual = <
  T extends DocumentReference<any> | CollectionReference<any>
>(
  v1: T | null | undefined,
  v2: T | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && refEqual(v1, v2);
  return bothNull || equal;
};

export const useIsFirestoreRefEqual = <
  T extends DocumentReference<any> | CollectionReference<any>
>(
  value: T | null | undefined,
  onChange?: () => void
): RefHook<T | null | undefined> => {
  return useComparatorRef(value, isRefEqual, onChange);
};

const isQueryEqual = <T extends Query<any>>(
  v1: T | null | undefined,
  v2: T | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && queryEqual(v1, v2);
  return bothNull || equal;
};

export const useIsFirestoreQueryEqual = <T extends Query<any>>(
  value: T | null | undefined,
  onChange?: () => void
): RefHook<T | null | undefined> => {
  return useComparatorRef(value, isQueryEqual, onChange);
};

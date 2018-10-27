// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect } from 'react';
import firebase, { typeof FirebaseError } from 'firebase/app';
import {
  type DocumentReference,
  type DocumentSnapshot,
  typeof QueryListenOptions,
} from 'firebase/firestore';
import { isString, useDataLoader } from '../util';

export type FirestoreDocumentValue = {|
  error?: FirebaseError,
  loading: boolean,
  value?: DocumentSnapshot,
|};

export default (
  pathOrRef: string | DocumentReference,
  options?: QueryListenOptions
): FirestoreDocumentValue => {
  const ref: DocumentReference = isString(pathOrRef)
    ? firebase.firestore().doc(pathOrRef)
    : pathOrRef;
  const { error, loading, setError, setValue, value } = useDataLoader<
    DocumentSnapshot
  >();

  useEffect(
    () => {
      const listener = options
        ? ref.onSnapshot(options, setValue, setError)
        : ref.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [pathOrRef]
  );

  return {
    error,
    loading,
    value,
  };
};

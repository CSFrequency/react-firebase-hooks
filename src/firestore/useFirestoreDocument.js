// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase, { typeof FirebaseError } from 'firebase/app';
import {
  type DocumentReference,
  type DocumentSnapshot,
  typeof QueryListenOptions,
} from 'firebase/firestore';
import { isString } from '../util';

export type FirestoreDocumentValue = {
  error?: FirebaseError,
  loading: boolean,
  value?: DocumentSnapshot,
};

export default (
  pathOrRef: string | DocumentReference,
  options?: QueryListenOptions
): FirestoreDocumentValue => {
  const ref: DocumentReference = isString(pathOrRef)
    ? firebase.firestore().doc(pathOrRef)
    : pathOrRef;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(undefined);

  const onError = (err: FirebaseError) => {
    setError(err);
    setLoading(false);
  };

  const onSnapshot = (snapshot: DocumentSnapshot) => {
    setValue(snapshot);
    setLoading(false);
  };

  useEffect(
    () => {
      const listener = options
        ? ref.onSnapshot(options, onSnapshot, onError)
        : ref.onSnapshot(onSnapshot, onError);

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

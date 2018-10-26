// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase, { typeof FirebaseError } from 'firebase/app';
import {
  type Query,
  type QuerySnapshot,
  typeof QueryListenOptions,
} from 'firebase/firestore';
import { isString } from '../util';

export type FirestoreCollectionValue = {
  error?: any,
  loading: boolean,
  value?: QuerySnapshot,
};

export default (
  pathOrQuery: string | Query,
  options?: QueryListenOptions
): FirestoreCollectionValue => {
  const query: Query = isString(pathOrQuery)
    ? firebase.firestore().collection(pathOrQuery)
    : pathOrQuery;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(undefined);

  const onError = (err: FirebaseError) => {
    setError(err);
    setLoading(false);
  };

  const onSnapshot = (snapshot: QuerySnapshot) => {
    setValue(snapshot);
    setLoading(false);
  };

  useEffect(
    () => {
      const listener = options
        ? query.onSnapshot(options, onSnapshot, onError)
        : query.onSnapshot(onSnapshot, onError);

      return () => {
        listener();
      };
    },
    // TODO: Check if this works suitably for 'query' parameters
    [pathOrQuery]
  );

  return {
    error,
    loading,
    value,
  };
};

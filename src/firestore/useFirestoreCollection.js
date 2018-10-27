// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect } from 'react';
import firebase, { typeof FirebaseError } from 'firebase/app';
import {
  type Query,
  type QuerySnapshot,
  typeof QueryListenOptions,
} from 'firebase/firestore';
import { isString, useDataLoader } from '../util';

export type FirestoreCollectionValue = {|
  error?: FirebaseError,
  loading: boolean,
  value?: QuerySnapshot,
|};

export default (
  pathOrQuery: string | Query,
  options?: QueryListenOptions
): FirestoreCollectionValue => {
  const query: Query = isString(pathOrQuery)
    ? firebase.firestore().collection(pathOrQuery)
    : pathOrQuery;
  const { error, loading, setError, setValue, value } = useDataLoader<
    QuerySnapshot
  >();

  useEffect(
    () => {
      const listener = options
        ? query.onSnapshot(options, setValue, setError)
        : query.onSnapshot(setValue, setError);

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

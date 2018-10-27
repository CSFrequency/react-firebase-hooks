// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import type { DataSnapshot, Reference } from 'firebase/database';
import { isString, useDataLoader } from '../util';

export type DatabaseValue = {
  error?: Object,
  loading: boolean,
  value?: DataSnapshot,
};

export default (pathOrRef: string | Reference): DatabaseValue => {
  const ref: Reference = isString(pathOrRef)
    ? firebase.database().ref(pathOrRef)
    : pathOrRef;
  const { error, loading, setError, setValue, value } = useDataLoader<
    DataSnapshot
  >();

  useEffect(
    () => {
      ref.on('value', setValue, setError);

      return () => {
        ref.off('value', setValue);
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

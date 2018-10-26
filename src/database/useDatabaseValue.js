// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import type { DataSnapshot, Reference } from 'firebase/database';
import { isString } from '../util';

export type DatabaseValue = {
  error?: any,
  loading: boolean,
  value?: any,
};

export default (pathOrRef: string | Reference): DatabaseValue => {
  const ref: Reference = isString(pathOrRef)
    ? firebase.database().ref(pathOrRef)
    : pathOrRef;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(undefined);

  const onError = (err: any) => {
    setError(err);
    setLoading(false);
  };

  const onSnapshot = (snapshot: DataSnapshot) => {
    setValue(snapshot.val());
    setLoading(false);
  };

  useEffect(
    () => {
      ref.on('value', onSnapshot, onError);

      return () => {
        ref.off('value', onSnapshot);
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

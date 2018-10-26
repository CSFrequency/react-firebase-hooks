// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import type { DataSnapshot, Reference } from 'firebase/database';
import { isString } from '../util';

export type DatabaseList = {
  error?: any,
  list: DataSnapshot[],
  loading: boolean,
};

export default (pathOrRef: string | Reference): DatabaseList => {
  const ref: Reference = isString(pathOrRef)
    ? firebase.database().ref(pathOrRef)
    : pathOrRef;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  // Combine keys and values in a single state hook to allow them to be manipulated together
  const [{ keys, values }, setKeysValues] = useState({ keys: [], values: [] });

  const onError = (err: any) => {
    setError(err);
    setLoading(false);
  };

  const onChildAdded = (snapshot: DataSnapshot, previousKey: ?string) => {
    setKeysValues(prevState => {
      const { newKeys, newValues } = addChild(
        prevState.keys,
        prevState.values,
        snapshot,
        previousKey
      );
      return {
        keys: newKeys,
        values: newValues,
      };
    });
  };

  const onChildChanged = (snapshot: DataSnapshot) => {
    setKeysValues(prevState => {
      const index = prevState.keys.indexOf(snapshot.key);
      return {
        ...prevState,
        values: [
          ...prevState.values.slice(0, index),
          snapshot,
          ...prevState.values.slice(index + 1),
        ],
      };
    });
  };

  const onChildMoved = (snapshot: DataSnapshot, previousKey: ?string) => {
    setKeysValues(prevState => {
      // Remove the child from it's previous location
      const { newKeys: tempKeys, newValues: tempValues } = removeChild(
        prevState.keys,
        prevState.values,
        snapshot
      );
      // Add the child into it's new location
      const { newKeys, newValues } = addChild(
        tempKeys,
        tempValues,
        snapshot,
        previousKey
      );
      return {
        keys: newKeys,
        values: newValues,
      };
    });
  };

  const onChildRemoved = (snapshot: DataSnapshot) => {
    setKeysValues(prevState => {
      const { newKeys, newValues } = removeChild(
        prevState.keys,
        prevState.values,
        snapshot
      );
      return {
        keys: newKeys,
        values: newValues,
      };
    });
  };

  useEffect(
    () => {
      // This is here to indicate that all the data has been successfully received
      ref.once(
        'value',
        () => {
          setLoading(false);
        },
        err => {
          setError(err);
        }
      );
      ref.on('child_added', onChildAdded);
      ref.on('child_changed', onChildChanged);
      ref.on('child_moved', onChildMoved);
      ref.on('child_removed', onChildRemoved);

      return () => {
        ref.off('child_added', onChildAdded);
        ref.off('child_changed', onChildChanged);
        ref.off('child_moved', onChildMoved);
        ref.off('child_removed', onChildRemoved);
      };
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [pathOrRef]
  );

  return {
    error,
    list: values,
    loading,
  };
};

const addChild = (
  keys: string[],
  values: any[],
  snapshot: DataSnapshot,
  previousKey: ?string
) => {
  if (!previousKey) {
    // The child has been added to the start of the list
    return {
      newKeys: [snapshot.key, ...keys],
      newValues: [snapshot, ...values],
    };
  }
  // Establish the index for the previous child in the list
  const index = keys.indexOf(previousKey);
  // Insert the item after the previous child
  return {
    newKeys: [
      ...keys.slice(0, index + 1),
      snapshot.key,
      ...keys.slice(index + 1),
    ],
    newValues: [
      ...values.slice(0, index + 1),
      snapshot,
      ...values.slice(index + 1),
    ],
  };
};

const removeChild = (keys: string[], values: any[], snapshot: DataSnapshot) => {
  const index = keys.indexOf(snapshot.key);
  return {
    newKeys: [...keys.slice(0, index), ...keys.slice(index + 1)],
    newValues: [...values.slice(0, index), ...values.slice(index + 1)],
  };
};

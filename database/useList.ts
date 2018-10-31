import { database } from 'firebase';
import { useEffect, useState } from 'react';

export type ListHook = {
  error?: Object;
  list: database.DataSnapshot[];
  loading: boolean;
};

type KeyValueState = {
  keys: string[];
  values: database.DataSnapshot[];
};

export default (query: database.Query): ListHook => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  // Combine keys and values in a single state hook to allow them to be manipulated together
  const [{ values }, setKeysValues] = useState({ keys: [], values: [] });

  const onChildAdded = (
    snapshot: database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    setKeysValues((prevKeyValueState: KeyValueState) => {
      return snapshot
        ? addChild(prevKeyValueState, snapshot, previousKey)
        : prevKeyValueState;
    });
  };

  const onChildChanged = (snapshot: database.DataSnapshot | null) => {
    setKeysValues((prevKeyValueState: KeyValueState) => {
      if (!snapshot || !snapshot.key) {
        return prevKeyValueState;
      }

      const index = prevKeyValueState.keys.indexOf(snapshot.key);
      return {
        ...prevKeyValueState,
        values: [
          ...prevKeyValueState.values.slice(0, index),
          snapshot,
          ...prevKeyValueState.values.slice(index + 1),
        ],
      };
    });
  };

  const onChildMoved = (
    snapshot: database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    setKeysValues((prevKeyValueState: KeyValueState) => {
      if (!snapshot) {
        return prevKeyValueState;
      }
      // Remove the child from it's previous location
      const tempKeyValueState = removeChild(prevKeyValueState, snapshot);
      // Add the child into it's new location
      return addChild(tempKeyValueState, snapshot, previousKey);
    });
  };

  const onChildRemoved = (snapshot: database.DataSnapshot | null) => {
    setKeysValues((prevKeyValueState: KeyValueState) => {
      return snapshot
        ? removeChild(prevKeyValueState, snapshot)
        : prevKeyValueState;
    });
  };

  useEffect(
    () => {
      // This is here to indicate that all the data has been successfully received
      query.once(
        'value',
        () => {
          setLoading(false);
        },
        (err: object) => {
          setError(err);
          setLoading(false);
        }
      );
      query.on('child_added', onChildAdded);
      query.on('child_changed', onChildChanged);
      query.on('child_moved', onChildMoved);
      query.on('child_removed', onChildRemoved);

      return () => {
        query.off('child_added', onChildAdded);
        query.off('child_changed', onChildChanged);
        query.off('child_moved', onChildMoved);
        query.off('child_removed', onChildRemoved);
      };
    },
    // TODO: Check if this works suitably for 'query' parameters
    [query]
  );

  return {
    error,
    list: values,
    loading,
  };
};

const addChild = (
  keyValueState: KeyValueState,
  snapshot: firebase.database.DataSnapshot,
  previousKey?: string | null
): KeyValueState => {
  if (!snapshot.key) {
    return keyValueState;
  }

  const { keys, values } = keyValueState;
  if (!previousKey) {
    // The child has been added to the start of the list
    return {
      keys: [snapshot.key, ...keys],
      values: [snapshot, ...values],
    };
  }
  // Establish the index for the previous child in the list
  const index = keys.indexOf(previousKey);
  // Insert the item after the previous child
  return {
    keys: [...keys.slice(0, index + 1), snapshot.key, ...keys.slice(index + 1)],
    values: [
      ...values.slice(0, index + 1),
      snapshot,
      ...values.slice(index + 1),
    ],
  };
};

const removeChild = (
  keyValueState: KeyValueState,
  snapshot: firebase.database.DataSnapshot
): KeyValueState => {
  if (!snapshot.key) {
    return keyValueState;
  }

  const { keys, values } = keyValueState;
  const index = keys.indexOf(snapshot.key);
  return {
    keys: [...keys.slice(0, index), ...keys.slice(index + 1)],
    values: [...values.slice(0, index), ...values.slice(index + 1)],
  };
};

import { database, FirebaseError } from 'firebase';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import useListReducer from './helpers/useListReducer';
import { LoadingHook, useIsEqualRef } from '../util';

export type ListHook = LoadingHook<database.DataSnapshot[], FirebaseError>;
export type ListKeysHook = LoadingHook<string[], FirebaseError>;
export type ListValsHook<T> = LoadingHook<T[], FirebaseError>;

export const useList = (query?: database.Query | null): ListHook => {
  const [state, dispatch] = useListReducer();

  const ref = useIsEqualRef(query, () => dispatch({ type: 'reset' }));

  const onChildAdded = (
    snapshot: database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    dispatch({ type: 'add', previousKey, snapshot });
  };

  const onChildChanged = (snapshot: database.DataSnapshot | null) => {
    dispatch({ type: 'change', snapshot });
  };

  const onChildMoved = (
    snapshot: database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    dispatch({ type: 'move', previousKey, snapshot });
  };

  const onChildRemoved = (snapshot: database.DataSnapshot | null) => {
    dispatch({ type: 'remove', snapshot });
  };

  const onError = (error: FirebaseError) => {
    dispatch({ type: 'error', error });
  };

  const onValue = () => {
    dispatch({ type: 'value' });
  };

  useEffect(() => {
    const query: database.Query | null | undefined = ref.current;
    if (!query) {
      dispatch({ type: 'empty' });
      return;
    }
    // This is here to indicate that all the data has been successfully received
    query.once('value', onValue, onError);
    query.on('child_added', onChildAdded, onError);
    query.on('child_changed', onChildChanged, onError);
    query.on('child_moved', onChildMoved, onError);
    query.on('child_removed', onChildRemoved, onError);

    return () => {
      query.off('child_added', onChildAdded);
      query.off('child_changed', onChildChanged);
      query.off('child_moved', onChildMoved);
      query.off('child_removed', onChildRemoved);
    };
  }, [ref.current]);

  return [state.value.values, state.loading, state.error];
};

export const useListKeys = (query?: database.Query | null): ListKeysHook => {
  const [value, loading, error] = useList(query);
  return [
    value ? value.map(snapshot => snapshot.key as string) : undefined,
    loading,
    error,
  ];
};

export const useListVals = <T>(
  query?: database.Query | null,
  options?: {
    keyField?: string;
  }
): ListValsHook<T> => {
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      snapshots
        ? snapshots.map(snapshot =>
            snapshotToData(snapshot, options ? options.keyField : undefined)
          )
        : undefined,
    [snapshots, options && options.keyField]
  );
  return [values, loading, error];
};

import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import useListReducer from './helpers/useListReducer';
import { LoadingHook, useIsEqualRef } from '../util';

export type ListHook = LoadingHook<
  firebase.database.DataSnapshot[],
  firebase.FirebaseError
>;
export type ListKeysHook = LoadingHook<string[], firebase.FirebaseError>;
export type ListValsHook<T> = LoadingHook<T[], firebase.FirebaseError>;

export const useList = (query?: firebase.database.Query | null): ListHook => {
  const [state, dispatch] = useListReducer();

  const ref = useIsEqualRef(query, () => dispatch({ type: 'reset' }));

  const onChildAdded = (
    snapshot: firebase.database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    dispatch({ type: 'add', previousKey, snapshot });
  };

  const onChildChanged = (snapshot: firebase.database.DataSnapshot | null) => {
    dispatch({ type: 'change', snapshot });
  };

  const onChildMoved = (
    snapshot: firebase.database.DataSnapshot | null,
    previousKey?: string | null
  ) => {
    dispatch({ type: 'move', previousKey, snapshot });
  };

  const onChildRemoved = (snapshot: firebase.database.DataSnapshot | null) => {
    dispatch({ type: 'remove', snapshot });
  };

  const onError = (error: firebase.FirebaseError) => {
    dispatch({ type: 'error', error });
  };

  const onValue = () => {
    dispatch({ type: 'value' });
  };

  useEffect(() => {
    const query: firebase.database.Query | null | undefined = ref.current;
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

  const resArray: ListHook = [state.value.values, state.loading, state.error];
  return useMemo(() => resArray, resArray);
};

export const useListKeys = (
  query?: firebase.database.Query | null
): ListKeysHook => {
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      snapshots
        ? snapshots.map((snapshot) => snapshot.key as string)
        : undefined,
    [snapshots]
  );
  const resArray: ListKeysHook = [values, loading, error];

  return useMemo(() => resArray, resArray);
};

export const useListVals = <T>(
  query?: firebase.database.Query | null,
  options?: {
    keyField?: string;
    refField?: string;
  }
): ListValsHook<T> => {
  const keyField = options ? options.keyField : undefined;
  const refField = options ? options.refField : undefined;
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      snapshots
        ? snapshots.map((snapshot) =>
            snapshotToData(snapshot, keyField, refField)
          )
        : undefined,
    [snapshots, keyField, refField]
  );

  const resArray: ListValsHook<T> = [values, loading, error];
  return useMemo(() => resArray, resArray);
};

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

  const queryRef = useIsEqualRef(query, () => dispatch({ type: 'reset' }));

  useEffect(() => {
    const ref: firebase.database.Query | null | undefined = queryRef.current;
    if (!ref) {
      dispatch({ type: 'empty' });
      return;
    }

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

    const onValue = (snapshots: firebase.database.DataSnapshot[] | null) => {
      dispatch({ type: 'value', snapshots });
    };

    let childAddedHandler: ReturnType<typeof ref.on> | undefined;
    const children: firebase.database.DataSnapshot[] = [];
    const onInitialLoad = (snapshot: firebase.database.DataSnapshot) => {
      let childrenToProcess = Object.keys(snapshot.val()).length;

      const onChildAddedWithoutInitialLoad = (
        addedChild: firebase.database.DataSnapshot,
        previousKey?: string
      ) => {
        // process the first batch of children all at once
        if (childrenToProcess > 0) {
          childrenToProcess--;
          children.push(addedChild);

          if (childrenToProcess === 0) {
            onValue(children);
          }

          return;
        }

        onChildAdded(snapshot, previousKey);
      };

      childAddedHandler = ref.on(
        'child_added',
        onChildAddedWithoutInitialLoad,
        onError
      );
    };

    ref.once('value', onInitialLoad, onError);
    const childChangedHandler = ref.on(
      'child_changed',
      onChildChanged,
      onError
    );
    const childMovedHandler = ref.on('child_moved', onChildMoved, onError);
    const childRemovedHandler = ref.on(
      'child_removed',
      onChildRemoved,
      onError
    );

    return () => {
      ref.off('child_added', childAddedHandler);
      ref.off('child_changed', childChangedHandler);
      ref.off('child_moved', childMovedHandler);
      ref.off('child_removed', childRemovedHandler);
    };
  }, [dispatch, queryRef]);

  const resArray: ListHook = [state.value.values, state.loading, state.error];
  return useMemo(() => resArray, resArray);
};

export const useListKeys = (query?: firebase.database.Query | null): ListKeysHook => {
  const [value, loading, error] = useList(query);
  return [
    value ? value.map((snapshot) => snapshot.key as string) : undefined,
    loading,
    error,
  ];
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
            snapshotToData(snapshot, options ? options.keyField : undefined, refField)
          )
        : undefined,
    [snapshots, options && options.keyField]
  );

  const resArray: ListValsHook<T> = [values, loading, error];
  return useMemo(() => resArray, resArray);
};

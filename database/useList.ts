import { useEffect, useMemo } from 'react';
import { snapshotToData, ValOptions } from './helpers';
import useListReducer from './helpers/useListReducer';
import { ListHook, ListKeysHook, ListValsHook, Val } from './types';
import { useIsEqualRef } from '../util';
import {
  DataSnapshot,
  Query,
  onChildAdded as firebaseOnChildAdded,
  onChildChanged as firebaseOnChildChanged,
  onChildMoved as firebaseOnChildMoved,
  onChildRemoved as firebaseOnChildRemoved,
  onValue as firebaseOnValue,
  off,
} from 'firebase/database';

export const useList = (query?: Query | null): ListHook => {
  const [state, dispatch] = useListReducer();

  const queryRef = useIsEqualRef(query, () => dispatch({ type: 'reset' }));
  const ref: Query | null | undefined = queryRef.current;

  useEffect(() => {
    if (!ref) {
      dispatch({ type: 'empty' });
      return;
    }

    const onChildAdded = (
      snapshot: DataSnapshot | null,
      previousKey?: string | null
    ) => {
      dispatch({ type: 'add', previousKey, snapshot });
    };

    const onChildChanged = (snapshot: DataSnapshot | null) => {
      dispatch({ type: 'change', snapshot });
    };

    const onChildMoved = (
      snapshot: DataSnapshot | null,
      previousKey?: string | null
    ) => {
      dispatch({ type: 'move', previousKey, snapshot });
    };

    const onChildRemoved = (snapshot: DataSnapshot | null) => {
      dispatch({ type: 'remove', snapshot });
    };

    const onError = (error: Error) => {
      dispatch({ type: 'error', error });
    };

    const onValue = (snapshots: DataSnapshot[] | null) => {
      dispatch({ type: 'value', snapshots });
    };

    let childAddedHandler: ReturnType<typeof firebaseOnChildAdded> | undefined;
    const onInitialLoad = (snapshot: DataSnapshot) => {
      const snapshotVal = snapshot.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(snapshot.val()).length
        : 0;

      // If the list is empty then initialise the hook and use the default `onChildAdded` behaviour
      if (childrenToProcess === 0) {
        childAddedHandler = firebaseOnChildAdded(ref, onChildAdded, onError);
        onValue([]);
      } else {
        // Otherwise, we load the first batch of children all to reduce re-renders
        const children: DataSnapshot[] = [];

        const onChildAddedWithoutInitialLoad = (
          addedChild: DataSnapshot,
          previousKey?: string | null
        ) => {
          if (childrenToProcess > 0) {
            childrenToProcess--;
            children.push(addedChild);

            if (childrenToProcess === 0) {
              onValue(children);
            }

            return;
          }

          onChildAdded(addedChild, previousKey);
        };

        childAddedHandler = firebaseOnChildAdded(
          ref,
          onChildAddedWithoutInitialLoad,
          onError
        );
      }
    };

    firebaseOnValue(ref, onInitialLoad, onError, { onlyOnce: true });
    const childChangedHandler = firebaseOnChildChanged(
      ref,
      onChildChanged,
      onError
    );
    const childMovedHandler = firebaseOnChildMoved(ref, onChildMoved, onError);
    const childRemovedHandler = firebaseOnChildRemoved(
      ref,
      onChildRemoved,
      onError
    );

    return () => {
      off(ref, 'child_added', childAddedHandler);
      off(ref, 'child_changed', childChangedHandler);
      off(ref, 'child_moved', childMovedHandler);
      off(ref, 'child_removed', childRemovedHandler);
    };
  }, [dispatch, ref]);

  const resArray: ListHook = [state.value.values, state.loading, state.error];
  return useMemo(() => resArray, resArray);
};

export const useListKeys = (query?: Query | null): ListKeysHook => {
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

export const useListVals = <
  T,
  KeyField extends string = '',
  RefField extends string = ''
>(
  query?: Query | null,
  options?: ValOptions<T>
): ListValsHook<T, KeyField, RefField> => {
  const keyField = options ? options.keyField : undefined;
  const refField = options ? options.refField : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      (snapshots
        ? snapshots.map((snapshot) =>
            snapshotToData(snapshot, keyField, refField, transform)
          )
        : undefined) as Val<T, KeyField, RefField>[],
    [snapshots, keyField, refField, transform]
  );

  const resArray: ListValsHook<T, KeyField, RefField> = [
    values,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

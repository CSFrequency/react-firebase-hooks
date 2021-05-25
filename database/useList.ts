import firebase from 'firebase/compat/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData, ValOptions } from './helpers';
import useListReducer from './helpers/useListReducer';
import { ListHook, ListKeysHook, ListValsHook, Val } from './types';
import { useIsEqualRef } from '../util';

export const useList = (query?: firebase.database.Query | null): ListHook => {
  const [state, dispatch] = useListReducer();

  const queryRef = useIsEqualRef(query, () => dispatch({ type: 'reset' }));
  const ref: firebase.database.Query | null | undefined = queryRef.current;

  useEffect(() => {
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

    const onChildChanged = (
      snapshot: firebase.database.DataSnapshot | null
    ) => {
      dispatch({ type: 'change', snapshot });
    };

    const onChildMoved = (
      snapshot: firebase.database.DataSnapshot | null,
      previousKey?: string | null
    ) => {
      dispatch({ type: 'move', previousKey, snapshot });
    };

    const onChildRemoved = (
      snapshot: firebase.database.DataSnapshot | null
    ) => {
      dispatch({ type: 'remove', snapshot });
    };

    const onError = (error: firebase.FirebaseError) => {
      dispatch({ type: 'error', error });
    };

    const onValue = (snapshots: firebase.database.DataSnapshot[] | null) => {
      dispatch({ type: 'value', snapshots });
    };

    let childAddedHandler: ReturnType<typeof ref.on> | undefined;
    const onInitialLoad = (snapshot: firebase.database.DataSnapshot) => {
      const snapshotVal = snapshot.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(snapshot.val()).length
        : 0;

      // If the list is empty then initialise the hook and use the default `onChildAdded` behaviour
      if (childrenToProcess === 0) {
        childAddedHandler = ref.on('child_added', onChildAdded, onError);
        onValue([]);
      } else {
        // Otherwise, we load the first batch of children all to reduce re-renders
        const children: firebase.database.DataSnapshot[] = [];

        const onChildAddedWithoutInitialLoad = (
          addedChild: firebase.database.DataSnapshot,
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

        childAddedHandler = ref.on(
          'child_added',
          onChildAddedWithoutInitialLoad,
          onError
        );
      }
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
  }, [dispatch, ref]);

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

export const useListVals = <
  T,
  KeyField extends string = '',
  RefField extends string = ''
>(
  query?: firebase.database.Query | null,
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

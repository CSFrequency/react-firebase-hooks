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

  const queryRef = useIsEqualRef(query, () => dispatch({ type: 'reset' }));

  useEffect(() => {
    const ref: database.Query | null | undefined = queryRef.current;
    if (!ref) {
      dispatch({ type: 'empty' });
      return;
    }

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

    const onValue = (snapshots: database.DataSnapshot[] | null) => {
      dispatch({ type: 'value', snapshots });
    };

    let childAddedHandler: ReturnType<typeof ref.on> | undefined;
    const children: database.DataSnapshot[] = [];
    const onInitialLoad = (snapshot: database.DataSnapshot) => {
      let childrenToProcess = Object.keys(snapshot.val()).length;

      const onChildAddedWithoutInitialLoad = (
        addedChild: database.DataSnapshot,
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

  return [state.value.values, state.loading, state.error];
};

export const useListKeys = (query?: database.Query | null): ListKeysHook => {
  const [value, loading, error] = useList(query);
  return [
    value ? value.map((snapshot) => snapshot.key as string) : undefined,
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
        ? snapshots.map((snapshot) =>
            snapshotToData(snapshot, options ? options.keyField : undefined)
          )
        : undefined,
    [snapshots, options && options.keyField]
  );
  return [values, loading, error];
};

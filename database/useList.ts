import { database } from 'firebase';
import { useEffect, useReducer } from 'react';
import { useIsEqualRef } from '../util';

export type ListHook = {
  error?: Object;
  loading: boolean;
  value: database.DataSnapshot[];
};

type KeyValueState = {
  keys: string[];
  values: database.DataSnapshot[];
};

type ReducerState = {
  error?: object;
  loading: boolean;
  value: KeyValueState;
};

type AddAction = {
  type: 'add';
  previousKey?: string | null;
  snapshot: database.DataSnapshot | null;
};
type ChangeAction = {
  type: 'change';
  snapshot: database.DataSnapshot | null;
};
type ErrorAction = { type: 'error'; error: object };
type MoveAction = {
  type: 'move';
  previousKey?: string | null;
  snapshot: database.DataSnapshot | null;
};
type RemoveAction = {
  type: 'remove';
  snapshot: database.DataSnapshot | null;
};
type ResetAction = { type: 'reset' };
type ValueAction = { type: 'value' };
type ReducerAction =
  | AddAction
  | ChangeAction
  | ErrorAction
  | MoveAction
  | RemoveAction
  | ResetAction
  | ValueAction;

const initialState: ReducerState = {
  loading: true,
  value: {
    keys: [],
    values: [],
  },
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case 'add':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        value: addChild(state.value, action.snapshot, action.previousKey),
      };
    case 'change':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        value: changeChild(state.value, action.snapshot),
      };
    case 'error':
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case 'move':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        value: moveChild(state.value, action.snapshot, action.previousKey),
      };
    case 'remove':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        value: removeChild(state.value, action.snapshot),
      };
    case 'reset':
      return initialState;
    case 'value':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default (query?: database.Query | null): ListHook => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  useEffect(
    () => {
      const query: database.Query | null | undefined = ref.current;
      if (!query) {
        dispatch({ type: 'value' });
        return;
      }
      // This is here to indicate that all the data has been successfully received
      query.once(
        'value',
        () => {
          dispatch({ type: 'value' });
        },
        (error: object) => {
          dispatch({ type: 'error', error });
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
    [ref.current]
  );

  return {
    error: state.error,
    loading: state.loading,
    value: state.value.values,
  };
};

const addChild = (
  currentState: KeyValueState,
  snapshot: firebase.database.DataSnapshot,
  previousKey?: string | null
): KeyValueState => {
  if (!snapshot.key) {
    return currentState;
  }

  const { keys, values } = currentState;
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

const changeChild = (
  currentState: KeyValueState,
  snapshot: firebase.database.DataSnapshot
): KeyValueState => {
  if (!snapshot.key) {
    return currentState;
  }
  const index = currentState.keys.indexOf(snapshot.key);
  return {
    ...currentState,
    values: [
      ...currentState.values.slice(0, index),
      snapshot,
      ...currentState.values.slice(index + 1),
    ],
  };
};

const removeChild = (
  currentState: KeyValueState,
  snapshot: firebase.database.DataSnapshot
): KeyValueState => {
  if (!snapshot.key) {
    return currentState;
  }

  const { keys, values } = currentState;
  const index = keys.indexOf(snapshot.key);
  return {
    keys: [...keys.slice(0, index), ...keys.slice(index + 1)],
    values: [...values.slice(0, index), ...values.slice(index + 1)],
  };
};

const moveChild = (
  currentState: KeyValueState,
  snapshot: firebase.database.DataSnapshot,
  previousKey?: string | null
): KeyValueState => {
  // Remove the child from it's previous location
  const tempValue = removeChild(currentState, snapshot);
  // Add the child into it's new location
  return addChild(tempValue, snapshot, previousKey);
};

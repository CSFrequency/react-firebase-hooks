import firebase from 'firebase/compat/app';
import { useReducer } from 'react';

type KeyValueState = {
  keys?: string[];
  values?: firebase.database.DataSnapshot[];
};

type ReducerState = {
  error?: firebase.FirebaseError;
  loading: boolean;
  value: KeyValueState;
};

type AddAction = {
  type: 'add';
  previousKey?: string | null;
  snapshot: firebase.database.DataSnapshot | null;
};
type ChangeAction = {
  type: 'change';
  snapshot: firebase.database.DataSnapshot | null;
};
type EmptyAction = { type: 'empty' };
type ErrorAction = { type: 'error'; error: firebase.FirebaseError };
type MoveAction = {
  type: 'move';
  previousKey?: string | null;
  snapshot: firebase.database.DataSnapshot | null;
};
type RemoveAction = {
  type: 'remove';
  snapshot: firebase.database.DataSnapshot | null;
};
type ResetAction = { type: 'reset' };
type ValueAction = { type: 'value'; snapshots: firebase.database.DataSnapshot[] | null };
type ReducerAction =
  | AddAction
  | ChangeAction
  | EmptyAction
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

const listReducer = (
  state: ReducerState,
  action: ReducerAction
): ReducerState => {
  switch (action.type) {
    case 'add':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        error: undefined,
        value: addChild(state.value, action.snapshot, action.previousKey),
      };
    case 'change':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        error: undefined,
        value: changeChild(state.value, action.snapshot),
      };
    case 'error':
      return {
        ...state,
        error: action.error,
        loading: false,
        value: {
          keys: undefined,
          values: undefined,
        },
      };
    case 'move':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        error: undefined,
        value: moveChild(state.value, action.snapshot, action.previousKey),
      };
    case 'remove':
      if (!action.snapshot) {
        return state;
      }
      return {
        ...state,
        error: undefined,
        value: removeChild(state.value, action.snapshot),
      };
    case 'reset':
      return initialState;
    case 'value':
      return {
        ...state,
        error: undefined,
        loading: false,
        value: setValue(action.snapshots),
      };
    case 'empty':
      return {
        ...state,
        loading: false,
        value: {
          keys: undefined,
          values: undefined,
        },
      };
    default:
      return state;
  }
};

const setValue = (snapshots: firebase.database.DataSnapshot[] | null): KeyValueState => {
  if (!snapshots) {
    return {
      keys: [],
      values: [],
    };
  }

  const keys: string[] = [];
  const values: firebase.database.DataSnapshot[] = [];
  snapshots.forEach((snapshot) => {
    if (!snapshot.key) {
      return;
    }
    keys.push(snapshot.key);
    values.push(snapshot);
  });

  return {
    keys,
    values,
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
      keys: keys ? [snapshot.key, ...keys] : [snapshot.key],
      values: values ? [snapshot, ...values] : [snapshot],
    };
  }
  // Establish the index for the previous child in the list
  const index = keys ? keys.indexOf(previousKey) : 0;
  // Insert the item after the previous child
  return {
    keys: keys
      ? [...keys.slice(0, index + 1), snapshot.key, ...keys.slice(index + 1)]
      : [snapshot.key],
    values: values
      ? [...values.slice(0, index + 1), snapshot, ...values.slice(index + 1)]
      : [snapshot],
  };
};

const changeChild = (
  currentState: KeyValueState,
  snapshot: firebase.database.DataSnapshot
): KeyValueState => {
  if (!snapshot.key) {
    return currentState;
  }
  const { keys, values } = currentState;
  const index = keys ? keys.indexOf(snapshot.key) : 0;
  return {
    ...currentState,
    values: values
      ? [...values.slice(0, index), snapshot, ...values.slice(index + 1)]
      : [snapshot],
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
  const index = keys ? keys.indexOf(snapshot.key) : 0;
  return {
    keys: keys ? [...keys.slice(0, index), ...keys.slice(index + 1)] : [],
    values: values
      ? [...values.slice(0, index), ...values.slice(index + 1)]
      : [],
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

export default () => useReducer(listReducer, initialState);

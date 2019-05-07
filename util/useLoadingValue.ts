import { useReducer } from 'react';
import { FirebaseError } from 'firebase';

export type LoadingValue<T> = {
  error?: FirebaseError;
  loading: boolean;
  reset: () => void;
  setError: (error: FirebaseError) => void;
  setValue: (value?: T | null) => void;
  value?: T;
};

type ReducerState = {
  error?: FirebaseError;
  loading: boolean;
  value?: any;
};

type ErrorAction = { type: 'error'; error: FirebaseError };
type ResetAction = { type: 'reset'; defaultValue?: any };
type ValueAction = { type: 'value'; value: any };
type ReducerAction = ErrorAction | ResetAction | ValueAction;

const defaultState = (defaultValue?: any) => {
  return {
    loading: defaultValue === undefined || defaultValue === null,
    value: defaultValue,
  };
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case 'error':
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case 'reset':
      return defaultState(action.defaultValue);
    case 'value':
      return {
        ...state,
        loading: false,
        value: action.value,
      };
    default:
      return state;
  }
};

export default <T>(getDefaultValue?: () => T | null): LoadingValue<T> => {
  const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
  const [state, dispatch] = useReducer(reducer, defaultState(defaultValue));

  const reset = () => {
    const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
    dispatch({ type: 'reset', defaultValue });
  };

  const setError = (error: FirebaseError) => {
    dispatch({ type: 'error', error });
  };

  const setValue = (value?: T | null) => {
    dispatch({ type: 'value', value });
  };

  return {
    error: state.error,
    loading: state.loading,
    reset,
    setError,
    setValue,
    value: state.value,
  };
};

import { useReducer } from 'react';

export type LoadingValue<T> = {
  error?: object;
  loading: boolean;
  reset: () => void;
  setError: (error: object) => void;
  setValue: (value: T | null) => void;
  value?: T;
};

type ReducerState = {
  error?: object;
  loading: boolean;
  value?: any;
};

type ErrorAction = { type: 'error'; error: object };
type ResetAction = { type: 'reset'; defaultValue?: any };
type ValueAction = { type: 'value'; value: any };
type ReducerAction = ErrorAction | ResetAction | ValueAction;

const initialState: ReducerState = {
  loading: true,
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
      return {
        ...state,
        value: action.defaultValue,
      };
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

export default <T>(defaultValue?: T): LoadingValue<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    value: defaultValue,
  });

  const reset = () => {
    dispatch({ type: 'reset', defaultValue });
  };

  const setError = (error: Object) => {
    dispatch({ type: 'error', error });
  };

  const setValue = (value: T | null) => {
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

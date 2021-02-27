import { useMemo, useReducer } from 'react';

export type LoadingValue<T, E> = {
  error?: E;
  loading: boolean;
  reset: () => void;
  setError: (error: E) => void;
  setValue: (value?: T) => void;
  value?: T;
};

type ReducerState<E> = {
  error?: E;
  loading: boolean;
  value?: any;
};

type ErrorAction<E> = { type: 'error'; error: E };
type ResetAction = { type: 'reset'; defaultValue?: any };
type ValueAction = { type: 'value'; value: any };
type ReducerAction<E> = ErrorAction<E> | ResetAction | ValueAction;

const defaultState = (defaultValue?: any) => {
  return {
    loading: defaultValue === undefined || defaultValue === null,
    value: defaultValue,
  };
};

const reducer = <E>() => (
  state: ReducerState<E>,
  action: ReducerAction<E>
): ReducerState<E> => {
  switch (action.type) {
    case 'error':
      return {
        ...state,
        error: action.error,
        loading: false,
        value: undefined,
      };
    case 'reset':
      return defaultState(action.defaultValue);
    case 'value':
      return {
        ...state,
        error: undefined,
        loading: false,
        value: action.value,
      };
    default:
      return state;
  }
};

export default <T, E>(getDefaultValue?: () => T): LoadingValue<T, E> => {
  const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
  const [state, dispatch] = useReducer(
    reducer<E>(),
    defaultState(defaultValue)
  );

  const reset = () => {
    const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
    dispatch({ type: 'reset', defaultValue });
  };

  const setError = (error: E) => {
    dispatch({ type: 'error', error });
  };

  const setValue = (value?: T) => {
    dispatch({ type: 'value', value });
  };

  return useMemo(
    () => ({
      error: state.error,
      loading: state.loading,
      reset,
      setError,
      setValue,
      value: state.value,
    }),
    [state.error, state.loading, reset, setError, setValue, state.value]
  );
};

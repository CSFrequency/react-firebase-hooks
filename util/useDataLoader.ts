import { useState } from 'react';

export type Value<T> = {
  error?: object;
  loading: boolean;
  reset: () => void;
  setError: (error: object) => void;
  setValue: (value: T | null) => void;
  value?: T;
};

export default <T>(defaultValue?: T): Value<T> => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(defaultValue);

  const onError = (err: Object) => {
    setError(err);
    setLoading(false);
  };

  const onValue = (v: T | null) => {
    setValue(v);
    setLoading(false);
  };

  const reset = () => {
    setError(undefined);
    setLoading(true);
    setValue(defaultValue);
  };

  return {
    error,
    loading,
    reset,
    setError: onError,
    setValue: onValue,
    value,
  };
};

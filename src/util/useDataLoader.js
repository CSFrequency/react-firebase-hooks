// @flow
// $FlowExpectedError: Pending proper flow types
import { useState } from 'react';

export type Value<T> = {|
  error?: Object,
  loading: boolean,
  setError: Object => void,
  setValue: (?T) => void,
  value?: T,
|};

export default <T>(defaultValue?: T): Value<T> => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(defaultValue);

  const onError = (err: Object) => {
    setError(err);
    setLoading(false);
  };

  const onValue = (v: ?T) => {
    setValue(v);
    setLoading(false);
  };

  return {
    error,
    loading,
    setError: onError,
    setValue: onValue,
    value,
  };
};

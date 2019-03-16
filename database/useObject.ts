import { database } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';

export type ObjectHook = {
  error?: object;
  loading: boolean;
  value?: database.DataSnapshot;
};

export default (query: database.Query | null | undefined): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    database.DataSnapshot
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      const query = ref.current;
      if (!query) return;

      query.on('value', setValue, setError);

      return () => {
        query.off('value', setValue);
      };
    },
    [ref.current]
  );

  return {
    error,
    loading,
    value,
  };
};

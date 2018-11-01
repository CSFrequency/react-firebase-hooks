import { database } from 'firebase';
import { useEffect, useRef } from 'react';
import { useLoadingValue } from '../util';

export type ObjectHook = {
  error?: object;
  loading: boolean;
  value?: database.DataSnapshot;
};

export default (query: database.Query): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    database.DataSnapshot
  >();
  // Set a ref for the query to make sure that `useEffect` doesn't run
  // every time this renders
  const queryRef = useRef(query);
  // If the query has changed, then
  if (!query.isEqual(queryRef.current)) {
    queryRef.current = query;
    reset();
  }

  useEffect(
    () => {
      const query: database.Query = queryRef.current;
      query.on('value', setValue, setError);

      return () => {
        query.off('value', setValue);
      };
    },
    [queryRef.current]
  );

  return {
    error,
    loading,
    value,
  };
};

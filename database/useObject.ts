import { database } from 'firebase';
import { useEffect } from 'react';
import { useDataLoader } from '../util';

export type ObjectHook = {
  error?: object;
  loading: boolean;
  value?: database.DataSnapshot;
};

export default (query: database.Query): ObjectHook => {
  const { error, loading, setError, setValue, value } = useDataLoader<
    database.DataSnapshot
  >();

  useEffect(
    () => {
      query.on('value', setValue, setError);

      return () => {
        query.off('value', setValue);
      };
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [query]
  );

  return {
    error,
    loading,
    value,
  };
};

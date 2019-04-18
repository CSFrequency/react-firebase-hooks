import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { CollectionHook } from './useCollection';

export default (
  query?: firestore.Query | null,
  options?: firestore.GetOptions
): CollectionHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      ref.current
        .get(options)
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  return {
    error,
    loading,
    value,
  };
};

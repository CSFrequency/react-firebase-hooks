import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { DocumentHook } from './useDocument';

export default (
  docRef?: firestore.DocumentReference | null,
  options?: firestore.GetOptions
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot
  >();
  const ref = useIsEqualRef(docRef, reset);

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

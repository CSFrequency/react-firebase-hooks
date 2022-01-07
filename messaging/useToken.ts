import { Messaging, getToken } from 'firebase/messaging';
import { useEffect, useMemo } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type TokenHook = LoadingHook<string | null, Error>;

export default (messaging: Messaging): TokenHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    string | null,
    Error
  >();

  useEffect(() => {
    getToken(messaging).then(setValue).catch(setError);
  }, [messaging]);

  const resArray: TokenHook = [value, loading, error];
  return useMemo<TokenHook>(() => resArray, resArray);
};

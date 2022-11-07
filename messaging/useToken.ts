import { getToken, Messaging } from 'firebase/messaging';
import { useEffect } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type TokenHook = LoadingHook<string | null, Error>;

export default (messaging: Messaging, vapidKey?: string): TokenHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    string | null,
    Error
  >();

  useEffect(() => {
    getToken(messaging, { vapidKey }).then(setValue).catch(setError);
  }, [messaging]);

  return [value, loading, error];
};

import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useMemo } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type AuthStateHook = LoadingHook<User | null, Error>;

export default (auth: Auth): AuthStateHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    User | null,
    Error
  >(() => auth.currentUser);

  useEffect(() => {
    return onAuthStateChanged(auth, setValue, setError);
  }, [auth]);

  const resArray: AuthStateHook = [value, loading, error];
  return useMemo<AuthStateHook>(() => resArray, resArray);
};

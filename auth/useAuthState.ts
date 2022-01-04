import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useMemo } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type AuthStateHook = LoadingHook<User | null, Error>;

export default (auth: firebase.auth.Auth, options: {onUserChanged?: (user?: firebase.User) => Promise<void>}): AuthStateHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    User | null,
    Error
  >(() => auth.currentUser);

  useEffect(() => {
    const listener = auth.onAuthStateChanged(async (user) => {
      if(typeof options?.onUserChanged === 'function') {
         // onUserLoaded function to process custom claims on any other trigger function
         try {
           await options.onUserChanged(user)
         } catch(e) {
           setError(e)
         }
      }
      setValue(user);
    }, setError);

    return () => {
      listener();
    };
  }, [auth]);

  const resArray: AuthStateHook = [value, loading, error];
  return useMemo<AuthStateHook>(() => resArray, resArray);
};

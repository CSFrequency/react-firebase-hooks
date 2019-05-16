import { auth, FirebaseError, User } from 'firebase';
import { useEffect } from 'react';
import { transformError } from './helpers';
import { LoadingHook, useLoadingValue } from '../util';

export type AuthStateHook = LoadingHook<User, FirebaseError>;

export default (auth: auth.Auth): AuthStateHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<User>(
    () => auth.currentUser
  );

  useEffect(
    () => {
      const listener = auth.onAuthStateChanged(setValue, (error: auth.Error) =>
        setError(transformError(error))
      );

      return () => {
        listener();
      };
    },
    [auth]
  );

  return [value, loading, error];
};

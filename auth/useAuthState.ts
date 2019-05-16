import { auth, User } from 'firebase';
import { useEffect } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type AuthStateHook = LoadingHook<User, auth.Error>;

export default (auth: auth.Auth): AuthStateHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    User,
    auth.Error
  >(() => auth.currentUser);

  useEffect(
    () => {
      const listener = auth.onAuthStateChanged(setValue, setError);

      return () => {
        listener();
      };
    },
    [auth]
  );

  return [value, loading, error];
};

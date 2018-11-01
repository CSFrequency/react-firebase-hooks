import { auth, User } from 'firebase';
import { useEffect } from 'react';
import { useLoadingValue } from '../util';

export type AuthStateHook = {
  user?: firebase.User;
  initialising: boolean;
};

export default (auth: auth.Auth): AuthStateHook => {
  const { loading, setValue, value } = useLoadingValue<User>();

  useEffect(
    () => {
      const listener = auth.onAuthStateChanged(setValue);

      return () => {
        listener();
      };
    },
    [auth]
  );

  return {
    initialising: loading,
    user: value,
  };
};

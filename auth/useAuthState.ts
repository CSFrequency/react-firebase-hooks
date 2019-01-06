import { auth, User } from 'firebase';
import { useEffect } from 'react';
import useLoadingValue from '../util/useLoadingValue';

export type AuthStateHook = {
  user?: firebase.User;
  initialising: boolean;
};

export default (auth: auth.Auth, defaultUser?: User = undefined): AuthStateHook => {
  const { loading, setValue, value } = useLoadingValue<User>(defaultUser);

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

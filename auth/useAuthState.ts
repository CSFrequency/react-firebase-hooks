import { auth, User } from 'firebase';
import { useEffect } from 'react';
import { useDataLoader } from '../util';

export type AuthStateHook = {
  user?: firebase.User;
  initialising: boolean;
};

export default (auth: auth.Auth): AuthStateHook => {
  const { loading, setValue, value } = useDataLoader<User>();

  useEffect(() => {
    const listener = auth.onAuthStateChanged(setValue);

    return () => {
      listener();
    };
  }, []);

  return {
    initialising: loading,
    user: value,
  };
};

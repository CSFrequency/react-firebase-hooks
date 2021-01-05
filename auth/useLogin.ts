import { useState, useMemo } from 'react';
import firebase from 'firebase/app';
import { AuthHookType } from '../util';

export type loginHook = AuthHookType<firebase.auth.UserCredential>;

export default (
  auth: firebase.auth.Auth,
  email: string,
  password: string
): loginHook => {
  const [error, setError] = useState<any>(null);
  const [
    loggedInUser,
    setLoggedInUser,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const login = () => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((resUser) => {
        setLoggedInUser(resUser);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const resArray: loginHook = [loggedInUser, error, login, loading];
  return useMemo<loginHook>(() => resArray, resArray);
};

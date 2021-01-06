import { useState, useMemo } from 'react';
import firebase from 'firebase/app';
import { AuthHookType } from '../util';

export type registerHook = AuthHookType<
  firebase.auth.UserCredential,
  firebase.FirebaseError
>;

export default (
  auth: firebase.auth.Auth,
  email: string,
  password: string
): registerHook => {
  const [error, setError] = useState<firebase.FirebaseError>();
  const [
    registeredUser,
    setRegisteredUser,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const register = () => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((resUser) => {
        setRegisteredUser(resUser);
        setLoading(false);
      })
      .catch((err: firebase.FirebaseError) => {
        setError(err);
        setLoading(false);
      });
  };

  const resArray: registerHook = [registeredUser, error, register, loading];
  return useMemo<registerHook>(() => resArray, resArray);
};

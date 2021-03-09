import { useState, useMemo } from 'react';
import firebase from 'firebase/app';
import { EmailAndPasswordActionHook } from './types';

export default (auth: firebase.auth.Auth): EmailAndPasswordActionHook => {
  const [error, setError] = useState<firebase.FirebaseError>();
  const [
    loggedInUser,
    setLoggedInUser,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      setLoggedInUser(user);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const resArray: EmailAndPasswordActionHook = [
    signInWithEmailAndPassword,
    loggedInUser,
    loading,
    error,
  ];
  return useMemo<EmailAndPasswordActionHook>(() => resArray, resArray);
};

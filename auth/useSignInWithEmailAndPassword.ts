import { useState, useMemo } from 'react';
import { Auth, UserCredential, signInWithEmailAndPassword as _signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { EmailAndPasswordActionHook } from './types';

export default (auth: Auth): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [
    loggedInUser,
    setLoggedInUser,
  ] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await _signInWithEmailAndPassword(auth, email, password);
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

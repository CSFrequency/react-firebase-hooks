import {
  Auth,
  UserCredential,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { useState, useMemo } from 'react';
import { EmailAndPasswordActionHook } from './types';

export default (auth: Auth): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await firebaseSignInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoggedInUser(user);
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
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

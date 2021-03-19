import { useState, useMemo } from 'react';
import firebase from 'firebase/app';
import { CreateUserOptions, EmailAndPasswordActionHook } from './types';

export default (
  auth: firebase.auth.Auth,
  options?: CreateUserOptions
): EmailAndPasswordActionHook => {
  const [error, setError] = useState<firebase.FirebaseError>();
  const [
    registeredUser,
    setRegisteredUser,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      if (options && options.sendEmailVerification && user.user) {
        await user.user.sendEmailVerification(options.emailVerificationOptions);
      }
      setRegisteredUser(user);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const resArray: EmailAndPasswordActionHook = [
    createUserWithEmailAndPassword,
    registeredUser,
    loading,
    error,
  ];
  return useMemo<EmailAndPasswordActionHook>(() => resArray, resArray);
};

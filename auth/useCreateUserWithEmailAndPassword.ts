import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';
import { useState, useMemo } from 'react';
import { CreateUserOptions, EmailAndPasswordActionHook } from './types';

export default (
  auth: Auth,
  options?: CreateUserOptions
): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [registeredUser, setRegisteredUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await firebaseCreateUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (options && options.sendEmailVerification && user.user) {
        await sendEmailVerification(
          user.user,
          options.emailVerificationOptions
        );
      }
      setRegisteredUser(user);
      setLoading(false);
    } catch (error) {
      setError(error as AuthError);
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

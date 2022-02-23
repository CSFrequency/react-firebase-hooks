import {
  Auth,
  AuthError,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
} from 'firebase/auth';
import { useMemo, useState } from 'react';
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
    setError(undefined);
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
    } catch (error) {
      setError(error as AuthError);
    } finally {
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

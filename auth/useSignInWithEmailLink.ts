import {
  Auth,
  AuthError,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  UserCredential,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { SignInWithEmailLinkHook } from './types';

export default (auth: Auth): SignInWithEmailLinkHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmailLink = useCallback(
    async (email: string, emailLink?: string) => {
      setLoading(true);
      setError(undefined);
      try {
        const user = await firebaseSignInWithEmailLink(auth, email, emailLink);
        setLoggedInUser(user);

        return user;
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  return [signInWithEmailLink, loggedInUser, loading, error];
};

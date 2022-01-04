import { useState, useMemo } from 'react';
import {
  Auth,
  AuthError,
  CustomParameters,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { GoogleActionHook } from './types';

export default (auth: Auth): GoogleActionHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      if (scopes) {
        scopes.forEach((scope) => provider.addScope(scope));
      }
      if (customOAuthParameters) {
        provider.setCustomParameters(customOAuthParameters);
      }
      const user = await signInWithPopup(auth, provider);
      setLoggedInUser(user);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: GoogleActionHook = [
    signInWithGoogle,
    loggedInUser,
    loading,
    error,
  ];
  return useMemo<GoogleActionHook>(() => resArray, resArray);
};

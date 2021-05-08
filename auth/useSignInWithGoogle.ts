import { useState, useMemo } from 'react';
import firebase from 'firebase/app';
import { GoogleActionHook } from './types';

export default (
  auth: firebase.auth.Auth,
  extraScopes: Array<string> = []
): GoogleActionHook => {
  const [error, setError] = useState<firebase.FirebaseError>();
  const [
    loggedInUser,
    setLoggedInUser,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      extraScopes.forEach((extraScope) => provider.addScope(extraScope));
      await auth.signInWithPopup(provider).then(setLoggedInUser);
      setLoading(false);
    } catch (err) {
      setError(err);
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

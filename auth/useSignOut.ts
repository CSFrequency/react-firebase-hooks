import { Auth, AuthError } from 'firebase/auth';
import { useMemo, useState } from 'react';

export type SignOutHook = [
  () => Promise<void>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SignOutHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = async () => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await auth.signOut();
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: SignOutHook = [signOut, loading, error];
  return useMemo<SignOutHook>(() => resArray, resArray);
};

import { Auth, AuthError } from 'firebase/auth';
import { useCallback, useState } from 'react';

export type SignOutHook = [
  () => Promise<boolean>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SignOutHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await auth.signOut();
      return true;
    } catch (err) {
      setError(err as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return [signOut, loading, error];
};

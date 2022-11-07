import { Auth, AuthError } from 'firebase/auth';
import { useCallback, useState } from 'react';

export type SignOutHook = [
  () => Promise<void>,
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
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return [signOut, loading, error];
};

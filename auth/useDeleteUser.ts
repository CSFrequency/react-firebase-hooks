import { Auth, AuthError } from 'firebase/auth';
import { useCallback, useState } from 'react';

export type DeleteUserHook = [
  () => Promise<boolean>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): DeleteUserHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteUser = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await auth.currentUser.delete();
        return true;
      } else {
        throw new Error('No user is logged in');
      }
    } catch (err) {
      setError(err as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return [deleteUser, loading, error];
};

import {
  ActionCodeSettings,
  Auth,
  AuthError,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

export type SendPasswordResetEmailHook = [
  (email: string, actionCodeSettings?: ActionCodeSettings) => Promise<boolean>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendPasswordResetEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendPasswordResetEmail = useCallback(
    async (email: string, actionCodeSettings?: ActionCodeSettings) => {
      setLoading(true);
      setError(undefined);
      try {
        await fbSendPasswordResetEmail(auth, email, actionCodeSettings);
        return true;
      } catch (err) {
        setError(err as AuthError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  return [sendPasswordResetEmail, loading, error];
};

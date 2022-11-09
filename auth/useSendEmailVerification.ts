import {
  Auth,
  AuthError,
  sendEmailVerification as fbSendEmailVerification,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

export type SendEmailVerificationHook = [
  () => Promise<boolean>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendEmailVerificationHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmailVerification = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await fbSendEmailVerification(auth.currentUser);
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

  return [sendEmailVerification, loading, error];
};

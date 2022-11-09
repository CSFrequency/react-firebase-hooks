import {
  ActionCodeSettings,
  Auth,
  AuthError,
  sendSignInLinkToEmail as fbSendSignInLinkToEmail,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

export type SendSignInLinkToEmailHook = [
  (email: string, actionCodeSettings: ActionCodeSettings) => Promise<boolean>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendSignInLinkToEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendSignInLinkToEmail = useCallback(
    async (email: string, actionCodeSettings: ActionCodeSettings) => {
      setLoading(true);
      setError(undefined);
      try {
        await fbSendSignInLinkToEmail(auth, email, actionCodeSettings);
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

  return [sendSignInLinkToEmail, loading, error];
};

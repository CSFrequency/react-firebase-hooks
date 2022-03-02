import {
  Auth,
  AuthError,
  ActionCodeSettings,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from 'firebase/auth';
import { useMemo, useState } from 'react';

export type SendPasswordResetEmailHook = [
  (email: string, actionCodeSettings?: ActionCodeSettings) => Promise<void>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendPasswordResetEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendPasswordResetEmail = async (
    email: string,
    actionCodeSettings?: ActionCodeSettings
  ) => {
    setLoading(true);
    setError(undefined);
    try {
      await fbSendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: SendPasswordResetEmailHook = [
    sendPasswordResetEmail,
    loading,
    error,
  ];
  return useMemo<SendPasswordResetEmailHook>(() => resArray, resArray);
};

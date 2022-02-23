import {
  Auth,
  AuthError,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from 'firebase/auth';
import { useMemo, useState } from 'react';

export type SendPasswordResetEmailHook = [
  (email: string) => Promise<void>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendPasswordResetEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    setError(undefined);
    try {
      await fbSendPasswordResetEmail(auth, email);
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

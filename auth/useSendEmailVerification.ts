import {
  Auth,
  AuthError,
  sendEmailVerification as fbSendEmailVerification,
} from 'firebase/auth';
import { useMemo, useState } from 'react';

export type SendEmailVerificationHook = [
  () => Promise<void>,
  boolean,
  AuthError | Error | undefined
];

export default (auth: Auth): SendEmailVerificationHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmailVerification = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await fbSendEmailVerification(auth.currentUser);
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: SendEmailVerificationHook = [
    sendEmailVerification,
    loading,
    error,
  ];
  return useMemo<SendEmailVerificationHook>(() => resArray, resArray);
};

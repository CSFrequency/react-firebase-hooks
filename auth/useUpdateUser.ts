import {
  ActionCodeSettings,
  Auth,
  AuthError,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  updateProfile as fbUpdateProfile,
  verifyBeforeUpdateEmail as fbVerifyBeforeUpdateEmail,
} from 'firebase/auth';
import { useMemo, useState } from 'react';

type Profile = {
  displayName?: string | null;
  photoURL?: string | null;
};

export type UpdateUserHook<M> = [M, boolean, AuthError | Error | undefined];

export type UpdateEmailHook = UpdateUserHook<(email: string) => Promise<void>>;
export type UpdatePasswordHook = UpdateUserHook<
  (password: string) => Promise<void>
>;
export type UpdateProfileHook = UpdateUserHook<
  (profile: Profile) => Promise<void>
>;
export type VerifyBeforeUpdateEmailHook = UpdateUserHook<
  (
    email: string,
    actionCodeSettings: ActionCodeSettings | null
  ) => Promise<void>
>;

export const useUpdateEmail = (auth: Auth): UpdateEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateEmail = async (email: string) => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await fbUpdateEmail(auth.currentUser, email);
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: UpdateEmailHook = [updateEmail, loading, error];
  return useMemo<UpdateEmailHook>(() => resArray, resArray);
};

export const useUpdatePassword = (auth: Auth): UpdatePasswordHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await fbUpdatePassword(auth.currentUser, password);
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: UpdatePasswordHook = [updatePassword, loading, error];
  return useMemo<UpdatePasswordHook>(() => resArray, resArray);
};

export const useUpdateProfile = (auth: Auth): UpdateProfileHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = async (profile: Profile) => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await fbUpdateProfile(auth.currentUser, profile);
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: UpdateProfileHook = [updateProfile, loading, error];
  return useMemo<UpdateProfileHook>(() => resArray, resArray);
};

export const useVerifyBeforeUpdateEmail = (
  auth: Auth
): VerifyBeforeUpdateEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const verifyBeforeUpdateEmail = async (
    email: string,
    actionCodeSettings: ActionCodeSettings | null
  ) => {
    setLoading(true);
    setError(undefined);
    try {
      if (auth.currentUser) {
        await fbVerifyBeforeUpdateEmail(auth.currentUser, email, actionCodeSettings);
      } else {
        setError(new Error('No user is logged in') as AuthError);
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: VerifyBeforeUpdateEmailHook = [
    verifyBeforeUpdateEmail,
    loading,
    error,
  ];
  return useMemo<VerifyBeforeUpdateEmailHook>(() => resArray, resArray);
};

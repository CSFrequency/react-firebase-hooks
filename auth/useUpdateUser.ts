import {
  ActionCodeSettings,
  Auth,
  AuthError,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  updateProfile as fbUpdateProfile,
  verifyBeforeUpdateEmail as fbVerifyBeforeUpdateEmail,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

type Profile = {
  displayName?: string | null;
  photoURL?: string | null;
};

export type UpdateUserHook<M> = [M, boolean, AuthError | Error | undefined];

export type UpdateEmailHook = UpdateUserHook<
  (email: string) => Promise<boolean>
>;
export type UpdatePasswordHook = UpdateUserHook<
  (password: string) => Promise<boolean>
>;
export type UpdateProfileHook = UpdateUserHook<
  (profile: Profile) => Promise<boolean>
>;
export type VerifyBeforeUpdateEmailHook = UpdateUserHook<
  (
    email: string,
    actionCodeSettings: ActionCodeSettings | null
  ) => Promise<boolean>
>;

export const useUpdateEmail = (auth: Auth): UpdateEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateEmail = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(undefined);
      try {
        if (auth.currentUser) {
          await fbUpdateEmail(auth.currentUser, email);
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
    },
    [auth]
  );

  return [updateEmail, loading, error];
};

export const useUpdatePassword = (auth: Auth): UpdatePasswordHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updatePassword = useCallback(
    async (password: string) => {
      setLoading(true);
      setError(undefined);
      try {
        if (auth.currentUser) {
          await fbUpdatePassword(auth.currentUser, password);
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
    },
    [auth]
  );

  return [updatePassword, loading, error];
};

export const useUpdateProfile = (auth: Auth): UpdateProfileHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = useCallback(
    async (profile: Profile) => {
      setLoading(true);
      setError(undefined);
      try {
        if (auth.currentUser) {
          await fbUpdateProfile(auth.currentUser, profile);
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
    },
    [auth]
  );

  return [updateProfile, loading, error];
};

export const useVerifyBeforeUpdateEmail = (
  auth: Auth
): VerifyBeforeUpdateEmailHook => {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const verifyBeforeUpdateEmail = useCallback(
    async (email: string, actionCodeSettings: ActionCodeSettings | null) => {
      setLoading(true);
      setError(undefined);
      try {
        if (auth.currentUser) {
          await fbVerifyBeforeUpdateEmail(
            auth.currentUser,
            email,
            actionCodeSettings
          );
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
    },
    [auth]
  );

  return [verifyBeforeUpdateEmail, loading, error];
};

import { ActionCodeSettings, UserCredential, AuthError } from 'firebase/auth';

export type AuthActionHook<T, E> = [
  (email: string, password: string) => void,
  T | undefined,
  boolean,
  E | undefined
];
export type CreateUserOptions = {
  emailVerificationOptions?: ActionCodeSettings;
  sendEmailVerification?: boolean;
};
export type EmailAndPasswordActionHook = AuthActionHook<
  UserCredential,
  AuthError
>;

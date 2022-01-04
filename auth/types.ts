import {
  ActionCodeSettings,
  AuthError,
  CustomParameters,
  UserCredential,
} from 'firebase/auth';

export type AuthActionHook<M> = [
  M,
  UserCredential | undefined,
  boolean,
  AuthError | undefined
];
export type CreateUserOptions = {
  emailVerificationOptions?: ActionCodeSettings;
  sendEmailVerification?: boolean;
};
export type EmailAndPasswordActionHook = AuthActionHook<
  (email: string, password: string) => Promise<void>
>;

export type SignInWithPopupHook = AuthActionHook<
  (scopes?: string[], customOAuthParameters?: CustomParameters) => Promise<void>
>;

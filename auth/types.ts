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
  (email: string, password: string) => Promise<UserCredential | undefined>
>;

export type SignInWithEmailLinkHook = AuthActionHook<
  (email: string, emailLink?: string) => Promise<UserCredential | undefined>
>;

export type SignInWithCustomTokenHook = AuthActionHook<
  (token: string) => Promise<UserCredential | undefined>
>;

export type SignInWithPopupHook = AuthActionHook<
  (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => Promise<UserCredential | undefined>
>;
